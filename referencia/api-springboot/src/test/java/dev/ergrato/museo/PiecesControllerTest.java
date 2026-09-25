package dev.ergrato.museo;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

// @WebMvcTest levanta solo la capa web; el servicio se reemplaza por un mock
@WebMvcTest(PiecesController.class)
class PiecesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PiecesService service;

    @Test
    @DisplayName("should respond 201 when body is valid")
    void shouldRespond201WhenBodyIsValid() throws Exception {
        when(service.create(any())).thenReturn(new Piece("Guernica", "Picasso", 1937));

        mockMvc.perform(post("/api/pieces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Guernica\",\"artist\":\"Picasso\",\"year\":1937}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Guernica"));
    }

    @Test
    @DisplayName("should respond 422 when service rejects the piece")
    void shouldRespond422WhenServiceRejectsThePiece() throws Exception {
        when(service.create(any())).thenThrow(new PiecesService.ValidationException("name is required"));

        mockMvc.perform(post("/api/pieces")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"artist\":\"Picasso\",\"year\":1937}"))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.detail").value("name is required"));
    }

    @Test
    @DisplayName("should respond 404 when piece does not exist")
    void shouldRespond404WhenPieceDoesNotExist() throws Exception {
        when(service.get(99L)).thenThrow(new PiecesService.NotFoundException("piece not found"));

        mockMvc.perform(get("/api/pieces/99"))
                .andExpect(status().isNotFound());
    }
}
