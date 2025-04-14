package com.esprit.userAuth.util;

// Commented out ML-related imports
/*
import ai.djl.engine.Engine;
import ai.djl.ndarray.NDArray;
import ai.djl.ndarray.NDManager;
import ai.djl.ndarray.types.Shape;
*/

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.File;
import java.util.Arrays;

/**
 * Utility class to test PyTorch loading
 * NOTE: This functionality is currently disabled.
 */
public class PyTorchTest {
    private static final Logger logger = LoggerFactory.getLogger(PyTorchTest.class);
    
    public static void main(String[] args) {
        logger.info("PyTorch functionality is disabled - test skipped");
        System.out.println("PyTorch functionality is disabled - test skipped");

        /* Original test code - now disabled
        logger.info("Starting PyTorch test");
        
        // Set cache directory
        String cacheDir = "C:/tensorflow-cache";
        System.setProperty("DJL_CACHE_DIR", cacheDir);
        System.setProperty("ai.djl.default_engine", "PyTorch");
        logger.info("Set DJL cache directory to: {}", cacheDir);
        
        // Ensure directories exist with proper permissions
        File cacheDirectory = new File(cacheDir);
        cacheDirectory.mkdirs();
        cacheDirectory.setWritable(true, false);
        
        File pytorchDir = new File(cacheDir + "/pytorch");
        pytorchDir.mkdirs();
        pytorchDir.setWritable(true, false);
        logger.info("Created PyTorch cache directories with write permissions");
        
        // Check if PyTorch libraries exist
        File libsDir = new File(cacheDir + "/pytorch");
        if (libsDir.exists()) {
            logger.info("PyTorch libraries directory exists at: {}", libsDir.getAbsolutePath());
            File[] files = libsDir.listFiles();
            if (files != null && files.length > 0) {
                logger.info("Found {} files in PyTorch directory", files.length);
                logger.info("First few PyTorch files: {}", 
                    Arrays.stream(files).limit(5).map(File::getName).collect(java.util.stream.Collectors.joining(", ")));
            } else {
                logger.warn("PyTorch directory exists but is empty");
            }
        } else {
            logger.warn("PyTorch libraries directory not found: {}", libsDir.getAbsolutePath());
        }
        
        try {
            // Try to get PyTorch engine
            logger.info("Attempting to get PyTorch engine...");
            Engine engine = Engine.getEngine("PyTorch");
            logger.info("✅ Successfully obtained PyTorch engine: {}", engine.getEngineName());
            logger.info("PyTorch engine version: {}", engine.getVersion());
            
            // Create NDManager from the engine
            logger.info("Creating NDManager...");
            NDManager manager = NDManager.newBaseManager();
            logger.info("✅ Successfully created NDManager");
            
            // Create a simple tensor to verify PyTorch operations
            logger.info("Creating test tensor...");
            NDArray testArray = manager.ones(new Shape(2, 3));
            logger.info("✅ Successfully created test tensor: {}", testArray);
            
            // Perform a simple operation
            logger.info("Performing test operation...");
            NDArray result = testArray.mul(3);
            logger.info("✅ Successfully performed operation, result: {}", result);
            
            // Cleanup
            testArray.close();
            result.close();
            manager.close();
            logger.info("Test completed successfully! PyTorch is working properly.");
        } catch (Exception e) {
            logger.error("❌ Failed to initialize or use PyTorch: {}", e.getMessage(), e);
        }
        */
    }
} 