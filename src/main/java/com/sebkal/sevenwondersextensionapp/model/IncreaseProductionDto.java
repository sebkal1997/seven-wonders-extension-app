package com.sebkal.sevenwondersextensionapp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncreaseProductionDto {

    private String memberName;

    private ResourceType resourceType;
}
