import React from 'react';
import { AnomalyChartOptions } from './types';
import {
  AnomalyObjectDataSourceTransformer,
  DataSourceLoader,
} from '../../data';

import { colorBackgroundContainerContent } from '@cloudscape-design/design-tokens';

import { useAnomalyEchart } from './hooks/useAnomalyEchart';
import { LoadingIcon } from './loading-icon';
import { Timestamp } from '../timestampBar';
import { AnomalyChartError } from './anomalyChartError';
import { useTransformedData } from './hooks/useTransformedData';
import { AnomalyChartEmpty } from './anomalyChartEmpty';
import { useUtilizedViewport } from '../../hooks/useViewport/useUtilizedViewport';
import { DEFAULT_ANOMALY_DATA_SOURCE_VIEWPORT } from '../../queries/useSiteWiseAnomalyDataSource/constants';

/**
 * Setup the applicable data source transformers
 */
const AnomalyDataSourceLoader = new DataSourceLoader([
  new AnomalyObjectDataSourceTransformer(),
]);

export const AnomalyChart = (options: AnomalyChartOptions) => {
  const { showTimestamp = true, viewport, ...configuration } = options;

  const {
    viewport: utilizedViewport,
    setViewport,
    viewportType,
  } = useUtilizedViewport({
    passedInViewport: viewport,
    defaultViewport: DEFAULT_ANOMALY_DATA_SOURCE_VIEWPORT,
  });

  const { data, description, loading, error, empty } = useTransformedData({
    ...configuration,
    loader: AnomalyDataSourceLoader,
    viewport: utilizedViewport,
  });
  const anomalyViewport =
    description?.dataExtent != null &&
    (viewportType === 'default' || viewportType === 'none')
      ? description.dataExtent
      : utilizedViewport;

  const { ref, sizeRef } = useAnomalyEchart({
    ...configuration,
    showTimestamp,
    data,
    description,
    loading,
    setViewport,
    viewport: anomalyViewport,
  });

  return (
    <div
      className='anomaly-chart'
      data-testid='anomaly-chart-container'
      style={{
        background: colorBackgroundContainerContent,
        width: '100%',
        height: '100%',
        position: 'relative',
        minHeight: 200,
        minWidth: 200,
      }}
      ref={sizeRef}
    >
      {empty && <AnomalyChartEmpty />}
      {error && <AnomalyChartError />}
      {!error && <LoadingIcon loading={loading} />}
      <div
        ref={ref}
        data-testid='anomaly-chart'
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      {showTimestamp && !error && (
        <Timestamp
          viewport={anomalyViewport}
          showLoadingIndicator={false}
          styleProps={{ width: 'calc(100% - 16px)', bottom: 35 }}
        />
      )}
    </div>
  );
};