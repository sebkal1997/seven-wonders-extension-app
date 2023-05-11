package com.sebkal.sevenwondersextensionapp.model;

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
}
