package com.esprit.userAuth.service;

// Commented out ML-related imports since ML functionality is disabled
/*
import ai.djl.Device;
import ai.djl.inference.Predictor;
import ai.djl.modality.cv.Image;
import ai.djl.modality.cv.ImageFactory;
import ai.djl.ndarray.NDArray;
import ai.djl.ndarray.NDList;
import ai.djl.ndarray.NDManager;
import ai.djl.ndarray.types.DataType;
import ai.djl.ndarray.types.Shape;
import ai.djl.repository.zoo.Criteria;
import ai.djl.repository.zoo.ZooModel;
import ai.djl.tensorflow.engine.TfModel;
import ai.djl.training.util.ProgressBar;
import ai.djl.translate.TranslateException;
import ai.djl.translate.Translator;
import ai.djl.translate.TranslatorContext;
*/

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.ConcurrentHashMap;
import java.io.File;
import java.util.Properties;
import java.util.Arrays;
import java.util.stream.Collectors;

// Commented out ML-related imports
/*
import ai.djl.engine.Engine;
import ai.djl.engine.EngineException;
import ai.djl.modality.Classifications;
*/

import com.esprit.userAuth.util.ModelConverter;

@Service
public class CertificateVerificationService {
    private static final Logger logger = LoggerFactory.getLogger(CertificateVerificationService.class);

    private static final int IMG_WIDTH = 256;
    private static final int IMG_HEIGHT = 256;
    
    // Commented out ML-related fields
    /*
    private ZooModel<Image, Float> model;
    private final ConcurrentHashMap<String, Predictor<Image, Float>> predictorCache = new ConcurrentHashMap<>();
    */
    
    private boolean modelLoaded = false;
    private Path modelPath = null;
    
    @Value("${djl.engine.cache-dir:djl-cache}")
    private String cacheDir;

    @PostConstruct
    public void init() {
        try {
            logger.info("Initializing certificate verification model with direct loading approach...");
            
            // Skip ML initialization - disabled
            logger.info("ML verification is disabled - using fallback verification only");
            modelLoaded = false;
            
            /* Original ML initialization code - now disabled
            // Set system properties for DJL
            System.setProperty("DJL_CACHE_DIR", cacheDir);
            logger.info("Set DJL cache directory to: {}", cacheDir);
            
            // Ensure the directories exist with proper permissions
            File cacheDirectory = new File(cacheDir);
            cacheDirectory.mkdirs();
            cacheDirectory.setWritable(true, false);
            
            File tensorflowDir = new File(cacheDir + "/tensorflow");
            tensorflowDir.mkdirs();
            tensorflowDir.setWritable(true, false);
            
            File pytorchDir = new File(cacheDir + "/pytorch");
            pytorchDir.mkdirs();
            pytorchDir.setWritable(true, false);
            
            logger.info("Created TensorFlow and PyTorch cache directories with write permissions");
            
            // Check if TensorFlow libraries exist
            File tfLibsDir = new File(cacheDir + "/tensorflow/2.10.1-cpu-win-x86_64");
            if (tfLibsDir.exists()) {
                logger.info("TensorFlow libraries directory exists at: {}", tfLibsDir.getAbsolutePath());
                File[] files = tfLibsDir.listFiles();
                if (files != null && files.length > 0) {
                    logger.info("Found {} files in TensorFlow directory", files.length);
                    logger.info("First few TensorFlow files: {}", 
                        Arrays.stream(files).limit(5).map(File::getName).collect(Collectors.joining(", ")));
                } else {
                    logger.warn("TensorFlow directory exists but is empty");
                }
            } else {
                logger.warn("TensorFlow libraries directory not found: {}", tfLibsDir.getAbsolutePath());
            }
            
            // Lower log levels for TensorFlow native loading
            System.setProperty("org.slf4j.simpleLogger.log.ai.djl.tensorflow", "warn");
            
            // Try to find the model file
            String[] modelPaths = {
                "fixed_model_v2.keras",
                "userAuth/target/classes/models/fixed_model_v2.keras",
                "userAuth/src/main/resources/models/fixed_model_v2.keras",
                new File("userAuth/target/classes/models/fixed_model_v2.keras").getAbsolutePath(),
                new File("userAuth/src/main/resources/models/fixed_model_v2.keras").getAbsolutePath(),
                "C:/Users/maiss/OneDrive/Documents/Desktop/try/fixed_model_v2.keras"
            };
            
            File modelFile = null;
            for (String path : modelPaths) {
                File file = new File(path);
                if (file.exists() && file.isFile()) {
                    modelFile = file;
                    modelPath = file.toPath();
                    logger.info("Found model file at: {}", file.getAbsolutePath());
                    break;
                }
            }
            
            if (modelFile == null) {
                throw new IOException("Could not find model file in any of the expected locations");
            }
            
            try {
                // Load model using the provided file path
                logger.info("Found model file at: {}", modelFile.getAbsolutePath());
                
                // Set up the criteria for loading the model
                try {
                    // Check if we need to convert the model from Keras to PyTorch
                    String modelAbsolutePath = modelFile.getAbsolutePath();
                    
                    // If it's a Keras model, try to convert it to PyTorch format
                    if (modelAbsolutePath.toLowerCase().endsWith(".keras") || 
                        modelAbsolutePath.toLowerCase().endsWith(".h5")) {
                        
                        logger.info("Keras model detected. Attempting to convert to PyTorch format...");
                        
                        // Check if a previously converted model exists
                        File convertedModelFile = new File("model_conversion/model.pt");
                        if (convertedModelFile.exists()) {
                            logger.info("Found existing converted model at {}", convertedModelFile.getAbsolutePath());
                            modelAbsolutePath = convertedModelFile.getAbsolutePath();
                        } else {
                            String convertedModelPath = ModelConverter.convertKerasToPyTorch(modelAbsolutePath);
                            
                            if (convertedModelPath != null) {
                                logger.info("Successfully converted model to PyTorch format: {}", convertedModelPath);
                                modelAbsolutePath = convertedModelPath;
                            } else {
                                logger.warn("Failed to convert model to PyTorch format. Will try to load original model.");
                            }
                        }
                    }
                    
                    // First try PyTorch for performance
                    logger.info("Loading model from path: {}", modelAbsolutePath);
                    Criteria<Image, Float> criteria = Criteria.builder()
                            .setTypes(Image.class, Float.class)
                            .optModelPath(Paths.get(modelAbsolutePath))
                            .optEngine("PyTorch")
                            .optTranslator(new CertificateTranslator())
                            .optDevice(Device.cpu())
                            .build();
                    
                    logger.info("Attempting to load model with PyTorch engine...");
                    Engine ptEngine = Engine.getEngine("PyTorch");
                    logger.info("Successfully obtained PyTorch engine: {}", ptEngine.getEngineName());
                    logger.info("PyTorch engine version: {}", ptEngine.getVersion());
                    
                    try {
                        model = criteria.loadModel();
                        logger.info("Successfully loaded model with PyTorch");
                        modelLoaded = true;
                    } catch (Exception e) {
                        logger.warn("PyTorch could not load the model format: {}", e.getMessage());
                        logger.info("Will use simplified implementation for certificate verification");
                        modelLoaded = false;
                    }
                } catch (EngineException e) {
                    logger.error("Error with PyTorch engine: {}", e.getMessage());
                    logger.info("Will use simplified implementation for certificate verification");
                    modelLoaded = false;
                }
            } catch (Exception e) {
                // Specific error handling for model loading failures
                logger.error("Failed to load ML model: {}", e.getMessage(), e);
                logger.error("Will use fallback verification method");
                modelLoaded = false;
            }
            */
            
        } catch (Exception e) {
            logger.error("Failed to initialize certificate verification: {}", e.getMessage(), e);
            modelLoaded = false;
        }
    }

    public boolean isCertificateReal(byte[] imageData) throws IOException {
        if (imageData == null || imageData.length == 0) {
            throw new IOException("Image data is empty");
        }
        
        // Always use fallback implementation because ML is disabled
        logger.info("Using enhanced fallback verification (ML disabled)");
        
        try {
            // Very basic validation of image data without using ML libraries
            // Check if the image has reasonable size (not too small, not too large)
            boolean hasReasonableSize = imageData.length > 50000 && imageData.length < 5000000;
            
            logger.info("Basic verification result: {} (size: {})", 
                    hasReasonableSize ? "REAL" : "FAKE", imageData.length);
            
            return hasReasonableSize;
        } catch (Exception e) {
            logger.error("Error in fallback verification: {}", e.getMessage());
            // Very basic fallback if even the enhanced check fails
            boolean isReal = imageData.length > 50000;
            logger.info("Simple fallback verification result: {} (size: {})", 
                    isReal ? "REAL" : "FAKE", imageData.length);
            return isReal;
        }
    }

    @PreDestroy
    public void cleanup() {
        logger.info("Cleaning up certificate verification resources");
        // Nothing to clean up since ML is disabled
    }

    public boolean isUsingMockImplementation() {
        // Always return true since we're using the mock implementation
        return true;
    }
    
    // Simple private class to replace the ML translator class
    private static class CertificateTranslator {
        // Empty implementation
    }
}