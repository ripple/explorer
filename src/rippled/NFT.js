import logger from './lib/logger';
import { formatNFTInfo } from './lib/utils';
import { getNFTInfo } from './lib/rippled';

const log = logger({ name: 'iou' });
const getNFT = async (tokenId, rippledSocket) => {
  try {
    const NFTInfo = await getNFTInfo(rippledSocket, tokenId);

    const {
      NFTId,
      ledgerIndex,
      owner,
      isBurned,
      flags,
      transferFee,
      issuer,
      NFTTaxon,
      NFTSequence,
      uri,
      validated,
      status,
      warnings,
    } = formatNFTInfo(NFTInfo);

    return {
      NFTId,
      ledgerIndex,
      owner,
      isBurned,
      flags,
      transferFee,
      issuer,
      NFTTaxon,
      NFTSequence,
      uri,
      validated,
      status,
      warnings,
    };
  } catch (error) {
    log.error(error.toString());
    throw error;
  }
};

export default getNFT;
