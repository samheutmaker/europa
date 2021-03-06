package com.distelli.europa.pipeline;

import com.distelli.europa.models.ContainerRepo;
import com.distelli.europa.models.Pipeline;
import com.distelli.europa.models.PipelineComponent;
import com.google.inject.Injector;
import javax.inject.Inject;
import javax.inject.Singleton;
import lombok.extern.log4j.Log4j;

@Log4j
@Singleton
public class RunPipeline {
    @Inject
    private Injector _injector;

    public void runPipeline(Pipeline pipeline, ContainerRepo repo, String tag, String digest) {
        for ( PipelineComponent component : pipeline.getComponents() ) {
            try {
                _injector.injectMembers(component);
                if ( ! component.execute(repo, tag, digest) ) break;
            } catch ( Exception ex ) {
                // Ignore exceptions caused by threads being interrupted:
                if ( ex instanceof java.io.InterruptedIOException ) return;
                log.error(ex.getMessage(), ex);
            }
        }
    }
}
