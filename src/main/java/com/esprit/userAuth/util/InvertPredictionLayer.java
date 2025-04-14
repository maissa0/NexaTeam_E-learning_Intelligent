package com.esprit.userAuth.util;

import java.util.Map;

// This is a placeholder class to represent the custom TensorFlow layer
// You'll need to integrate with TensorFlow Java properly
public class InvertPredictionLayer {
    // This class should implement the TensorFlow Layer interface
    // and provide the same functionality as the Python version

    public InvertPredictionLayer(Map<String, Object> config) {
        // Constructor for deserialization
    }

    public float call(float input) {
        return 1.0f - input;
    }

    public Map<String, Object> getConfig() {
        return Map.of();
    }
}