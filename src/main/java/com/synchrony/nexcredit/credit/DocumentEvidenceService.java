package com.synchrony.nexcredit.credit;

import org.apache.tika.Tika;
import org.springframework.stereotype.Service;

import com.synchrony.nexcredit.ai.VectorStore;

import java.nio.file.Path;
import java.util.Optional;

@Service
public class DocumentEvidenceService {
    private static final int MAX_PREVIEW_CHARACTERS = 4000;
    private final DocumentEvidenceRepository documentEvidenceRepository;
    private final VectorStore vectorStore;

    public DocumentEvidenceService(DocumentEvidenceRepository documentEvidenceRepository, VectorStore vectorStore) {
        this.documentEvidenceRepository = documentEvidenceRepository;
        this.vectorStore = vectorStore;
    }

    public DocumentEvidence extractAndStore(Long applicationId, String documentPath, String originalFileName) {
        String preview = null;
        String status = "EXTRACTION_FAILED";
        try {
            Tika tika = new Tika();
            tika.setMaxStringLength(MAX_PREVIEW_CHARACTERS);
            preview = normalize(tika.parseToString(Path.of(documentPath).toFile()));
            status = preview.isEmpty() ? "NO_TEXT_DETECTED" : "EXTRACTED";
        } catch (Exception ignored) {
            // An upload remains available to a reviewer even when its text cannot be extracted.
        }
        DocumentEvidence evidence = documentEvidenceRepository.save(new DocumentEvidence(applicationId, originalFileName, status, preview));
        vectorStore.indexEvidence(evidence.getId(), "document", originalFileName, preview);
        return evidence;
    }

    public Optional<DocumentEvidence> getLatestEvidence(Long applicationId) {
        return documentEvidenceRepository.findTopByApplicationIdOrderByCreatedAtDesc(applicationId);
    }

    private String normalize(String extractedText) {
        if (extractedText == null) {
            return "";
        }
        String compact = extractedText.replaceAll("\\s+", " ").trim();
        return compact.length() <= MAX_PREVIEW_CHARACTERS
                ? compact
                : compact.substring(0, MAX_PREVIEW_CHARACTERS);
    }
}
