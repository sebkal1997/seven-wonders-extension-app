package com.sebkal.sevenwondersextensionapp.model;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Game {

    private List<Member> members;

    private int stage = 1;

    private int round = 1;
}
