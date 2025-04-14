package com.esprit.userAuth.util;

/**import ai.djl.ndarray.NDArray;
import ai.djl.ndarray.NDList;
import ai.djl.ndarray.NDManager;
import ai.djl.ndarray.types.DataType;
import ai.djl.ndarray.types.Shape;
import ai.djl.nn.AbstractBlock;
import ai.djl.training.ParameterStore;
import ai.djl.util.PairList;


 * A custom layer that inverts the prediction value (1 - x).
 * This is needed for compatibility with the Keras model that has a custom InvertPrediction layer.

public class InvertPredictionLayer extends AbstractBlock {

    public InvertPredictionLayer() {
        super();
    }

    @Override
    protected NDList forwardInternal(
            ParameterStore parameterStore,
            NDList inputs,
            boolean training,
            PairList<String, Object> params) {
        NDArray input = inputs.singletonOrThrow();
        NDManager manager = input.getManager();
        
        // Create an array filled with 1.0
        NDArray ones = manager.ones(input.getShape());
        
        // Subtract the input from 1.0
        NDArray inverted = ones.sub(input);
        
        return new NDList(inverted);
    }

    @Override
    public Shape[] getOutputShapes(Shape[] inputShapes) {
        return inputShapes;
    }

    @Override
    public void initializeChildBlocks(NDManager manager, DataType dataType, Shape... inputShapes) {
        // No child blocks to initialize
    }
} */
