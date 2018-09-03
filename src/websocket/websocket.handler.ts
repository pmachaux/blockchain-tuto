import {WsMessage} from './websocket-message.interface';
import {WsType} from './websocket.constant';
import {Block} from '../blockchain/models/block.model';
import {BlockchainHandler} from '../blockchain/blockchain.handler';

export class WebsocketHandler {

    constructor(private blockChainHandler: BlockchainHandler) {
    }

    getHandlers(): any {
        return {
            [WsType.GET_ALL_BLOCKCHAIN]: this.getAllBlockChain.bind(this),
            [WsType.GET_LATEST_BLOCK]: this.getLatestBlock.bind(this),
            [WsType.PROCESS_BLOCKCHAIN]: this.processBlockChain.bind(this)
        };
    }

    async handleWsMessage(message: WsMessage): Promise<WsMessage | null> {
        const exec = this.getHandlers()[message.type];
        if (!exec) {
            return null;
        }
        return exec(message.data);
    }

    getAllBlockChain(): WsMessage {
        return {
            type: WsType.PROCESS_BLOCKCHAIN,
            data: this.blockChainHandler.getAllBlockChain()
        };
    }

    getLatestBlock(): WsMessage {
        return {
            type: WsType.PROCESS_BLOCKCHAIN,
            data: this.blockChainHandler.getLatestBlock()
        };
    }

    async processBlockChain(data: string): Promise<WsMessage> {
        try {
            const blocks = this.blockChainHandler.processBlockChain(data);
            if (blocks) {
                return {
                    type: WsType.PROCESS_BLOCKCHAIN,
                    data: blocks
                }
            } else {
                return null;
            }
        } catch (e) {
            return {
                type: WsType.GET_ALL_BLOCKCHAIN
            }
        }

    }
}