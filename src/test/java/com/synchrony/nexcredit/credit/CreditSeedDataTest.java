package com.synchrony.nexcredit.credit;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CreditSeedDataTest {

    @Test
    void creates_five_demo_applications_for_an_empty_database() {
        CreditApplicationRepository repository = mock(CreditApplicationRepository.class);
        when(repository.count()).thenReturn(0L);

        new CreditSeedData(repository).seedApplications();

        ArgumentCaptor<List<CreditApplication>> applications = ArgumentCaptor.forClass(List.class);
        verify(repository).saveAll(applications.capture());
        assertThat(applications.getValue()).hasSize(5);
        assertThat(applications.getValue()).extracting(CreditApplication::getApplicantName)
                .containsExactly("Ravi Kumar", "Priya Sharma", "Amit Patel", "Sneha Reddy", "Vikram Singh");
    }
}
