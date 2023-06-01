package com.sebkal.sevenwondersextensionapp.model;

import com.sebkal.sevenwondersextensionapp.exception.GameFinishedException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Game {

    private List<Member> members = new ArrayList<>();

    private int stage = 1;

    private int round = 1;

    public Member getMemberByName(String name) {
        return this.members.stream()
                .filter(member -> name.equals(member.getName()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(String.format("Member with name %s does not exists.", name)));
    }

    public void changeRound() {
        setNewRoundAndStage();
        generateResources();
    }

    public void increaseProductionForMember(IncreaseProductionDto data) {
        this.getMembers()
                .stream()
                .filter(member -> data.getMemberName().equals(member.getName()))
                .forEach(member -> member.getResources()
                        .stream()
                        .filter(resource -> data.getResourceType().equals(resource.getType()))
                        .forEach(Resource::increaseProduction));
    }

    private void generateResources() {
        members.forEach(member -> {
            member.getResources().forEach(Resource::produceResource);
        });
    }

    private void setNewRoundAndStage() {
        if (this.round == 8) {
            if (this.stage == 3) {
                throw new GameFinishedException("Game is finished.");
            } else {
                this.stage += 1;
                this.round = 1;
            }
        } else {
            this.round += 1;
        }
    }
}
