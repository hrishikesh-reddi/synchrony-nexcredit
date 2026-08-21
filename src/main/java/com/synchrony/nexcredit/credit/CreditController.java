package com.synchrony.nexcredit.credit;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.synchrony.nexcredit.ai.EvidenceSearchRequest;
import com.synchrony.nexcredit.ai.ExplanationResponse;
import com.synchrony.nexcredit.ai.ExplanationService;
import com.synchrony.nexcredit.ai.SearchHit;
import com.synchrony.nexcredit.ai.VectorStore;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/credit")
public class CreditController {
    private final CreditApplicationService applicationService;
    private final CreditUnderwritingService underwritingService;
    private final DocumentEvidenceService documentEvidenceService;
    private final VectorStore vectorStore;
    private final ExplanationService explanationService;

    public CreditController(CreditApplicationService applicationService,
                            CreditUnderwritingService underwritingService,
                            DocumentEvidenceService documentEvidenceService,
                            VectorStore vectorStore,
                            ExplanationService explanationService) {
        this.applicationService = applicationService;
        this.underwritingService = underwritingService;
        this.documentEvidenceService = documentEvidenceService;
        this.vectorStore = vectorStore;
        this.explanationService = explanationService;
    }

    @GetMapping("/applications")
    public List<CreditApplication> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/pending-review")
    public List<CreditApplication> getPendingReviewApplications() {
        return applicationService.getPendingReviewApplications();
    }

    @PostMapping("/applications")
    @ResponseStatus(HttpStatus.CREATED)
    public CreditApplication createApplication(@Valid @RequestBody CreditApplication application) {
        return applicationService.save(application);
    }

    @PostMapping("/analyze")
    public CreditDecision analyze(@Valid @RequestBody CreditApplication application) {
        return underwritingService.analyze(application);
    }

    @PostMapping("/review/{applicationId}")
    public CreditApplication reviewApplication(@PathVariable Long applicationId,
                                                @RequestBody(required = false) ReviewRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("A reviewer decision is required");
        }
        return applicationService.review(applicationId, request.getDecision(), request.getReviewerNotes());
    }

    @PostMapping("/upload")
    public Map<String, String> uploadDocument(
            @RequestParam Long applicationId,
            @RequestParam("file") MultipartFile file) {
        String documentPath = applicationService.storeDocument(applicationId, file);
        String originalName = file.getOriginalFilename() == null ? "document" : file.getOriginalFilename();
        DocumentEvidence evidence = documentEvidenceService.extractAndStore(applicationId, documentPath, originalName);
        Map<String, String> response = new LinkedHashMap<>();
        response.put("documentPath", documentPath);
        response.put("extractionStatus", evidence.getExtractionStatus());
        response.put("textPreview", evidence.getTextPreview() == null ? "" : evidence.getTextPreview());
        return response;
    }

    @GetMapping("/evidence/{applicationId}")
    public DocumentEvidence getLatestDocumentEvidence(@PathVariable Long applicationId) {
        return documentEvidenceService.getLatestEvidence(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No document evidence found"));
    }

    @PostMapping("/evidence/search")
    public Map<String, Object> searchEvidence(@Valid @RequestBody EvidenceSearchRequest request) {
        int k = request.k() == null || request.k() < 1 ? 5 : Math.min(request.k(), 25);
        List<SearchHit> hits = vectorStore.search(request.query() == null ? "" : request.query(), k);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("semanticSearchAvailable", vectorStore.isAvailable());
        response.put("results", hits);
        return response;
    }

    @PostMapping("/explanation")
    public ExplanationResponse explanation(@Valid @RequestBody CreditApplication application) {
        CreditDecision decision = underwritingService.analyze(application);
        return explanationService.explain(application, decision);
    }
}
