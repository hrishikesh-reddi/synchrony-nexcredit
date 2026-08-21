package com.synchrony.nexcredit.ai;

import com.synchrony.nexcredit.credit.CreditApplication;
import com.synchrony.nexcredit.credit.EmploymentType;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class MlRiskModelTest {

    private MlRiskModel trainedModel() {
        AiProperties props = mock(AiProperties.class);
        when(props.isMlEnabled()).thenReturn(true);
        MlRiskModel model = new MlRiskModel(props);
        model.train();
        return model;
    }

    private CreditApplication strong() {
        CreditApplication app = new CreditApplication();
        app.setAge(30);
        app.setAnnualIncome(BigDecimal.valueOf(600000));
        app.setEmploymentType(EmploymentType.SALARIED);
        app.setMobileUsageScore(88);
        app.setTransactionBehaviorScore(82);
        app.setSocialSignalScore(70);
        return app;
    }

    private CreditApplication weak() {
        CreditApplication app = new CreditApplication();
        app.setAge(40);
        app.setAnnualIncome(BigDecimal.valueOf(60000));
        app.setEmploymentType(EmploymentType.STUDENT);
        app.setMobileUsageScore(8);
        app.setTransactionBehaviorScore(10);
        app.setSocialSignalScore(12);
        return app;
    }

    @Test
    void trains_and_becomes_available() {
        assertThat(trainedModel().isAvailable()).isTrue();
    }

    @Test
    void strong_profile_scores_high() {
        MlRiskModel model = trainedModel();
        assertThat(model.predictProbability(strong())).isGreaterThan(0.7);
        assertThat(model.riskBand(model.predictProbability(strong()))).isEqualTo("LOW");
    }

    @Test
    void weak_profile_scores_low() {
        MlRiskModel model = trainedModel();
        assertThat(model.predictProbability(weak())).isLessThan(0.3);
        assertThat(model.riskBand(model.predictProbability(weak()))).isEqualTo("HIGH");
    }

    @Test
    void produces_feature_contributions() {
        MlRiskModel model = trainedModel();
        assertThat(model.contributions(strong())).isNotEmpty();
    }

    @Test
    void age_is_not_an_ml_feature() throws Exception {
        java.lang.reflect.Field field = MlRiskModel.class.getDeclaredField("FEATURES");
        field.setAccessible(true);
        String[] features = (String[]) field.get(null);
        assertThat(features).doesNotContain("age");

        MlRiskModel model = trainedModel();
        assertThat(model.contributions(strong())).doesNotContainKey("age");
    }
}
