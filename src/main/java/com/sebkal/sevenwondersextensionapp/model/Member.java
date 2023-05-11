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

    public void transferResources(Member member, List<Resource> resources) {
        if (checkIfMemberHasEnoughResources(resources)) {
            resources.forEach(resource -> {
                final ResourceType resourceType = resource.getType();
                final int resourceAmount = resource.getAmount();
                getResourceWithType(resourceType).decreaseAmount(resourceAmount);
                member.getResourceWithType(resourceType).increaseAmount(resourceAmount);
            });
        } else {
            throw new IllegalArgumentException(String.format("Member %s don`t have enough resources", this.name));
        }
    }

    public Resource getResourceWithType(ResourceType resourceType) {
        return this.resources.stream()
                .filter(resource -> resourceType.equals(resource.getType()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Resource is missing"));
    }

    private boolean checkIfMemberHasEnoughResources(List<Resource> resourcesToTransfer) {
        final List<Boolean> isValidAmoutResources = this.resources.stream()
                .map(resource -> resourcesToTransfer.stream()
                        .filter(resourceToTransfer -> resource.getType().equals(resourceToTransfer.getType()))
                        .map(resourceToTransfer -> resource.getAmount() == resourceToTransfer.getAmount())
                        .findFirst()
                        .orElse(Boolean.FALSE))
                .toList();
        return isValidAmoutResources.contains(Boolean.FALSE);
    }
}
