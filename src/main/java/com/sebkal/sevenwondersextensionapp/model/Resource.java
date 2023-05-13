package com.sebkal.sevenwondersextensionapp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    private ResourceType type;

    private int amount = 0;

    private int productionValue = 0;

    public void increaseAmount(int amount) {
        this.amount += amount;
    }

    public void decreaseAmount(int amount) {
        this.amount -= amount;
    }

    public void increaseProduction(int productionValue) {
        this.productionValue += productionValue;
    }

    public void produceResource() {
        this.amount += this.productionValue;
    }
}
