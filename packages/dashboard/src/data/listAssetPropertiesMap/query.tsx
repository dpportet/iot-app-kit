import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import {
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
} from '@iot-app-kit/source-iotsitewise';
import { listAssetPropertiesWithComposite } from '~/hooks/listAssetPropertiesWithAssetDescription';

// QUERY KEY
export const ASSET_DESCRIPTION_QUERY_KEY = ['assetDescriptions'];
export const createListAssetPropertiesMapCacheKey = (
  siteWiseQuery:
    | Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
    | undefined
): string[] => {
  return [
    ...ASSET_DESCRIPTION_QUERY_KEY,
    'assetDescriptionsMap',
    ...(siteWiseQuery?.assets?.map(
      ({ assetId }: { assetId: string }) => assetId
    ) ?? []),
  ];
};

// QUERY FUNCTION
const listAssetProperties = (client: IoTSiteWiseClient, assetId: string) => {
  return new listAssetPropertiesWithComposite({ assetId, client }).send();
};

const listPropertiesSiteWiseAssetQuery = async (
  client: IoTSiteWiseClient,
  siteWiseQuery: Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
) => {
  const assetPropertiesPromises =
    siteWiseQuery.assets?.map(async ({ assetId }: { assetId: string }) => {
      try {
        return await listAssetProperties(client, assetId);
      } catch (error) {
        console.error(
          `Error retrieving asset properties for asset ID ${assetId}:`,
          error
        );
        return [];
      }
    }) ?? [];
  return Promise.all(assetPropertiesPromises);
};

export const createFetchSiteWiseAssetQueryDescription =
  (
    iotSiteWiseClient?: IoTSiteWiseClient,
    siteWiseQuery?:
      | Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
      | undefined
  ) =>
  async () => {
    if (!iotSiteWiseClient || !siteWiseQuery) return [];
    return listPropertiesSiteWiseAssetQuery(iotSiteWiseClient, siteWiseQuery);
  };
