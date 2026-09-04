package com.avento.dto;

import com.avento.entity.WishlistItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistDto {
    private Long id;
    private Long eventId;
    private String title;
    private String category;
    private String fee;
    private String date;
    private String venue;
    private String mode;
    private String image;

    public static WishlistDto fromEntity(WishlistItem item) {
        if (item == null || item.getEvent() == null) return null;
        return WishlistDto.builder()
                .id(item.getId())
                .eventId(item.getEvent().getId())
                .title(item.getEvent().getTitle())
                .category(item.getEvent().getCategory())
                .fee(item.getEvent().getFee())
                .date(item.getEvent().getDate())
                .venue(item.getEvent().getVenue())
                .mode(item.getEvent().getMode())
                .image(item.getEvent().getImage())
                .build();
    }
}
