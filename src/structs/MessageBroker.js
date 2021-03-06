import EventEmitter from 'eventemitter3'
import MessageBrokerAdapter from '../interfaces/MessageBrokerAdapter'

/**
 * @template T
 * @class
 * @author Daniel Kalevski
 * @since 0.5.0
 * @license {}
 * 
 * // TODO: short docs
 */
class MessageBroker {

    /**
     * @callback MessageListener
     * @param {T} message
     */

    /**
     * 
     * @private
     * @type {string}
     */
    namespace = null

     /**
     * 
     * @private
     * @type {string}
     */
    address = null

     /**
     * 
     * @private
     * @type {MessageBrokerAdapter}
     */
    adapter = null

    /**
     * 
     * @private
     * @type {boolean}
     */
    subscribed = false

    /**
     * 
     * @private
     * @type {EventEmitter.<T>}
     */
    emitter = null

    /**
     * @license {@link https://github.com/rivalis/rivalis-core/blob/main/LICENSE}
     * @author Daniel Kalevski
     * @since 0.5.0
     * 
     * // TODO: write description
     * 
     * @param {MessageBrokerAdapter} adapter 
     * @param {string} namespace
     * @param {string} address 
     */
    constructor(adapter, namespace, address) {
        this.namespace = namespace
        this.address = address
        this.adapter = adapter
        this.emitter = new EventEmitter()
    }

    /**
     * 
     * @returns {Promise.<void>}
     */
    initialize() {
        if (!this.subscribed) {
            return this.adapter.subscribe(this.namespace, this.address, this.messageHandler)
        } else {
            return Promise.resolve()
        }
    }

    /**
     * 
     * @param {MessageListener} listener 
     * @param {any} context 
     */
    subscribe(listener, context) {
        this.emitter.on('message', listener, context)
    }

    /**
     * 
     * @param {MessageListener} listener 
     * @param {any} context 
     */
    unsubscribe(listener, context) {
        this.emitter.off('message', listener, context)
    }

    /**
     * 
     * @param {T} message
     * @returns {Promise.<void>}
     */
    emit(message) {
        return this.adapter.publish(this.namespace, this.address, this.mapInput(message))
    }

    /**
     * 
     * @returns {Promise.<void>}
     */
    dispose() {
        return this.adapter.unsubscribe(this.namespace, this.address, this.messageHandler)
    }

    /**
     * 
     * @protected
     * @param {T} message
     * @returns {string} 
     */
    mapInput = message => JSON.stringify(message)

    /**
     * 
     * @protected
     * @param {string} message
     * @returns {T} 
     */
     mapOutput = message => JSON.parse(message)

    /**
     * @private
     * @param {string} message 
     */
    messageHandler = message => {
        message = this.mapOutput(message)
        this.emitter.emit('message', message)
    }

}

export default MessageBroker