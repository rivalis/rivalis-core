import SharedStorageAdapter from '../interfaces/SharedStorageAdapter'
import SharedStorage from '../structs/SharedStorage'
import ActorObject from '../models/ActorObject'
/**
 * 
 * @extends {SharedStorage<ActorObject>}
 */
class ActorStorage extends SharedStorage {
    
    /**
     * @license {@link https://github.com/rivalis/rivalis-core/blob/main/LICENSE}
     * @author Daniel Kalevski
     * @since 0.5.0
     * 
     * // TODO: write description
     * 
     * @param {SharedStorageAdapter} adapter 
     * @param {string} contextId 
     */
    constructor(adapter, contextId) {
        super(adapter, `${contextId}-actors`)
    }
}

export default ActorStorage