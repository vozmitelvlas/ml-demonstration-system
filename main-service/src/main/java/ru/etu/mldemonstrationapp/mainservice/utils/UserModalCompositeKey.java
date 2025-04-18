package ru.etu.mldemonstrationapp.mainservice.utils;

import java.util.Objects;

public class UserModalCompositeKey {
    private final Long first;
    private final Long second;

    public UserModalCompositeKey(Long first, Long second) {
        this.first = first;
        this.second = second;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserModalCompositeKey that = (UserModalCompositeKey) o;
        return Objects.equals(first, that.first) &&
                Objects.equals(second, that.second);
    }

    @Override
    public int hashCode() {
        return Objects.hash(first, second);
    }
}
