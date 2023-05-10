package com.sebkal.sevenwondersextensionapp.model;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    private String name;

    private List<Resource> resources;

    public static Member create(String name) {
        final List<Resource> resources = new ArrayList<>();
        resources.add(Resource.builder().type(ResourceType.WOOD).build());
        resources.add(Resource.builder().type(ResourceType.IRON).build());
        resources.add(Resource.builder().type(ResourceType.GLASS).build());
        resources.add(Resource.builder().type(ResourceType.MATERIAL).build());
        resources.add(Resource.builder().type(ResourceType.STONE).build());
        return Member.builder()
                .name(name)
                .resources(resources)
                .build();
    }
}
