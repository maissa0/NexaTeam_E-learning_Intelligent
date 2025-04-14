package com.esprit.userAuth.service;



import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.tensorflow.SavedModelBundle;
import org.tensorflow.Tensor;
import org.tensorflow.ndarray.Shape;
import org.tensorflow.ndarray.buffer.DataBuffers;
import org.tensorflow.types.TFloat32;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.FloatBuffer;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
public class CertificateVerificationService {

    private SavedModelBundle model;
    private final int IMG_WIDTH = 256;
    private final int IMG_HEIGHT = 256;
    private final String MODEL_PATH = "path/to/models/fixed_model_v2"; // Update this path

    // Custom layer definition for TensorFlow model loading
    static {
        try {
            // Registering the custom layer class - this is important for loading the model
            Map<String, String> config = new HashMap<>();
            config.put("InvertPrediction", "com.esprit.userAuth.util.InvertPredictionLayer");
        } catch (Exception e) {
            throw new RuntimeException("Failed to register custom TensorFlow layer", e);
        }
    }

    public CertificateVerificationService() {
        try {
            // Load model at startup
            model = SavedModelBundle.load(MODEL_PATH, "serve");
        } catch (Exception e) {
            throw new RuntimeException("Failed to load TensorFlow model", e);
        }
    }

    public boolean isCertificateReal(byte[] imageData) throws IOException {
        // Read image from byte array
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageData));

        // Resize to expected dimensions
        BufferedImage resizedImage = resizeImage(originalImage, IMG_WIDTH, IMG_HEIGHT);

        // Convert to RGB if necessary
        BufferedImage rgbImage = new BufferedImage(IMG_WIDTH, IMG_HEIGHT, BufferedImage.TYPE_INT_RGB);
        rgbImage.createGraphics().drawImage(resizedImage, 0, 0, null);

        // Convert to float array and normalize (divide by 255)
        float[][][][] inputData = new float[1][IMG_HEIGHT][IMG_WIDTH][3];

        for (int y = 0; y < IMG_HEIGHT; y++) {
            for (int x = 0; x < IMG_WIDTH; x++) {
                int rgb = rgbImage.getRGB(x, y);
                inputData[0][y][x][0] = ((rgb >> 16) & 0xFF) / 255.0f;  // Red
                inputData[0][y][x][1] = ((rgb >> 8) & 0xFF) / 255.0f;   // Green
                inputData[0][y][x][2] = (rgb & 0xFF) / 255.0f;          // Blue
            }
        }

        // Create input tensor
        FloatBuffer fb = FloatBuffer.allocate(IMG_HEIGHT * IMG_WIDTH * 3);
        for (int y = 0; y < IMG_HEIGHT; y++) {
            for (int x = 0; x < IMG_WIDTH; x++) {
                for (int c = 0; c < 3; c++) {
                    fb.put(inputData[0][y][x][c]);
                }
            }
        }
        fb.flip();

        Tensor inputTensor = TFloat32.tensorOf(Shape.of(1, IMG_HEIGHT, IMG_WIDTH, 3), DataBuffers.of(fb));

        // Run inference
        Map<String, Tensor> outputs = model.session().runner()
                .feed("serving_default_input_1", inputTensor)
                .fetch("StatefulPartitionedCall")
                .run();

        // Get result
        float[] outputArray = new float[1];
        outputs.get("StatefulPartitionedCall").asRawTensor().data().asFloats().read(outputArray);

        // Close tensors to free resources
        inputTensor.close();
        for (Tensor output : outputs.values()) {
            output.close();
        }

        // Return true if real (prediction < 0.5), false if fake
        return outputArray[0] < 0.5;
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        java.awt.Image resultingImage = originalImage.getScaledInstance(targetWidth, targetHeight, java.awt.Image.SCALE_SMOOTH);
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        resizedImage.getGraphics().drawImage(resultingImage, 0, 0, null);
        return resizedImage;
    }
}