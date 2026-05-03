package com.requirementmaster.backend.application.mapper;

import com.requirementmaster.backend.application.dto.response.MessageResponse;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {

    public MessageResponse toMessageResponse(String message) {
        return MessageResponse.builder().message(message).build();
    }
}