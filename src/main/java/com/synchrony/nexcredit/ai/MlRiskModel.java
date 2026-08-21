package com.synchrony.nexcredit.ai;

import com.synchrony.nexcredit.credit.CreditApplication;
import com.synchrony.nexcredit.credit.EmploymentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Random;

@Service
public class MlRiskModel {

    private static final Logger LOGGER = LoggerFactory.getLogger(MlRiskModel.class);
    private static final String[] FEATURES = {"mobile", "transaction", "social", "income", "employment"};
    private static final int SAMPLES = 3000;
    private static final int ITERATIONS = 2500;
    private static final double LEARNING_RATE = 0.15;
    private static final double L2 = 0.01;

    private final AiProperties props;
    private volatile boolean available = false;
    private double[] weights;
    private double bias;
    private double[] featureLo;
    private double[] featureHi;

    @Autowired
    public MlRiskModel(AiProperties props) {
        this.props = props;
    }

    @PostConstruct
    public void train() {
        if (!props.isMlEnabled()) {
            LOGGER.info("ml_risk_model disabled; using rule-based scorer");
            return;
        }
        try {
            Random rng = new Random(42);
            double[][] raw = new double[SAMPLES][FEATURES.length];
            int[] y = new int[SAMPLES];
            for (int i = 0; i < SAMPLES; i++) {
                int mobile = rng.nextInt(101);
                int transaction = rng.nextInt(101);
                int social = rng.nextInt(101);
                double income = rng.nextInt(2_000_001);
                double employment = encode(EmploymentType.values()[rng.nextInt(EmploymentType.values().length)]);
                raw[i][0] = mobile;
                raw[i][1] = transaction;
                raw[i][2] = social;
                raw[i][3] = income;
                raw[i][4] = employment;
                double score = 0.30 * norm(mobile, 0, 100)
                        + 0.30 * norm(transaction, 0, 100)
                        + 0.22 * norm(social, 0, 100)
                        + 0.13 * norm(income, 0, 2_000_000)
                        + 0.05 * employment
                        + (rng.nextGaussian() * 0.07);
                y[i] = score > 0.52 ? 1 : 0;
            }
            double[] lo = new double[FEATURES.length];
            double[] hi = new double[FEATURES.length];
            for (int j = 0; j < FEATURES.length; j++) {
                lo[j] = Double.MAX_VALUE;
                hi[j] = -Double.MAX_VALUE;
                for (int k = 0; k < SAMPLES; k++) {
                    lo[j] = Math.min(lo[j], raw[k][j]);
                    hi[j] = Math.max(hi[j], raw[k][j]);
                }
            }
            this.featureLo = lo;
            this.featureHi = hi;
            double[][] x = new double[SAMPLES][FEATURES.length];
            for (int i = 0; i < SAMPLES; i++) {
                for (int j = 0; j < FEATURES.length; j++) {
                    x[i][j] = norm(raw[i][j], lo[j], hi[j]);
                }
            }
            fit(x, y);
            available = true;
            LOGGER.info("ml_risk_model trained on {} NTC samples; available for inference", SAMPLES);
        } catch (Exception e) {
            available = false;
            LOGGER.warn("ml_risk_model training failed; falling back to rule-based scorer: {}", e.getMessage());
        }
    }

    private void fit(double[][] x, int[] y) {
        int n = x.length;
        int p = x[0].length;
        weights = new double[p];
        bias = 0.0;
        for (int iter = 0; iter < ITERATIONS; iter++) {
            double[] gw = new double[p];
            double gb = 0.0;
            for (int i = 0; i < n; i++) {
                double z = bias;
                for (int j = 0; j < p; j++) {
                    z += weights[j] * x[i][j];
                }
                double p1 = sigmoid(z);
                double err = p1 - y[i];
                gb += err;
                for (int j = 0; j < p; j++) {
                    gw[j] += err * x[i][j];
                }
            }
            bias -= LEARNING_RATE * (gb / n);
            for (int j = 0; j < p; j++) {
                weights[j] -= LEARNING_RATE * (gw[j] / n + L2 * weights[j]);
            }
        }
    }

    public boolean isAvailable() {
        return available;
    }

    public double predictProbability(CreditApplication app) {
        if (!available) {
            return 0.5;
        }
        double[] x = features(app);
        double z = bias;
        for (int j = 0; j < x.length; j++) {
            z += weights[j] * x[j];
        }
        return sigmoid(z);
    }

    public Map<String, Double> contributions(CreditApplication app) {
        Map<String, Double> out = new LinkedHashMap<>();
        if (!available) {
            return out;
        }
        double[] x = features(app);
        for (int j = 0; j < FEATURES.length; j++) {
            out.put(FEATURES[j], weights[j] * x[j]);
        }
        return out;
    }

    public String riskBand(double probability) {
        if (probability >= 0.66) {
            return "LOW";
        }
        if (probability <= 0.33) {
            return "HIGH";
        }
        return "MEDIUM";
    }

    private double[] features(CreditApplication app) {
        double[] x = new double[FEATURES.length];
        x[0] = norm(app.getMobileUsageScore() == null ? 0 : app.getMobileUsageScore(), lo(0, 0), hi(0, 100));
        x[1] = norm(app.getTransactionBehaviorScore() == null ? 0 : app.getTransactionBehaviorScore(), lo(1, 0), hi(1, 100));
        x[2] = norm(app.getSocialSignalScore() == null ? 0 : app.getSocialSignalScore(), lo(2, 0), hi(2, 100));
        x[3] = norm(app.getAnnualIncome() == null ? 0 : app.getAnnualIncome().doubleValue(), lo(3, 0), hi(3, 2_000_000));
        x[4] = norm(encode(app.getEmploymentType()), lo(4, 0), hi(4, 1));
        return x;
    }

    private double lo(int j, double fallback) {
        return featureLo != null ? featureLo[j] : fallback;
    }

    private double hi(int j, double fallback) {
        return featureHi != null ? featureHi[j] : fallback;
    }

    private double encode(EmploymentType type) {
        if (type == null) {
            return 0.4;
        }
        return switch (type) {
            case SALARIED -> 1.0;
            case SELF_EMPLOYED -> 0.7;
            case GIG_WORKER -> 0.45;
            case STUDENT -> 0.2;
        };
    }

    private double norm(double value, double lo, double hi) {
        if (hi - lo == 0) {
            return 0.0;
        }
        return Math.max(0.0, Math.min(1.0, (value - lo) / (hi - lo)));
    }

    private double sigmoid(double z) {
        if (z >= 0) {
            return 1.0 / (1.0 + Math.exp(-z));
        }
        double exp = Math.exp(z);
        return exp / (1.0 + exp);
    }
}
