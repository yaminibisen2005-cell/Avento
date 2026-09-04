package com.avento.service;

import com.avento.dto.GlobalSearchResult;

import java.util.List;

public interface SearchService {
    List<GlobalSearchResult> search(String query, String type);
}
