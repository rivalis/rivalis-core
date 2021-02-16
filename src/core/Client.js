import EventEmitter from 'eventemitter3'
import Message from '../models/Message'

/**
 * @callback MessageListener
 * @param {any} message
 */

class Client {

    /**
     * 
     * @private
     * @type {EventEmitter>}
     */
    emitter = null

    /**
     * 
     * @private
     * @type {boolean}
     */
    _ready = false

    constructor() {
        this.emitter = new EventEmitter()
    }

    /**
     * 
     * @param {string} contextId 
     * @param {string} actorId 
     * @param {Object.<string,any>} data 
     */
    join(contextId, actorId, data = {}) {
        this.check()
        if (typeof contextId !== 'string') {
            throw new Error('contextId must be a string')
        }

        if (typeof actorId !== 'string') {
            throw new Error('actorId must be a string')
        }

        if (typeof data !== 'object') {
            throw new Error('data must be an object')
        }

        const message = JSON.stringify({
            kind: 'join',
            content: { contextId, actorId, data }
        })
        this.sendMessage(message)
    }

    /**
     * 
     * @param {string} type 
     * @param {any} data 
     */
    execute(type, data) {
        this.check()
        const message = JSON.stringify({
            kind: 'action',
            content: { type, data, time: new Date().getTime() }
        })
        this.sendMessage(message)
    }

    /**
     * 
     * @param {string} event 
     * @param {MessageListener} listener 
     * @param {any} context 
     */
    on(event, listener, context) {
        this.emitter.on(event, listener, context)
    }

    /**
     * 
     * @param {string} event 
     * @param {MessageListener} listener 
     * @param {any} context 
     */
    off(event, listener, context) {
        this.emitter.off(event, listener, context)
    }

    /**
     * 
     * @protected
     */
    ready() {
        this._ready = true
        this.emitter.emit('ready')
    }

    /**
     * 
     * @private
     */
    check() {
        if (!this._ready) {
            throw new Error('connection is not ready, event "ready" will be fired when client is able to communicate to server')
        }
    }

    /**
     * 
     * @protected
     * @param {Object.<string, any>} content 
     */
    handleMessage(content) {
        let { code, data } = content
        if (code === 'message') {
            data = new Message(data)
        }
        this.emitter.emit(code, data)
    }

    /**
     * 
     * @protected
     * @param {string} message 
     */
    sendMessage(message) {}

}

export default Client