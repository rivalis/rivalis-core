import KVStorageAdapter from '../KVStorageAdapter'

class InMemoryKVStorageAdapter extends KVStorageAdapter {
    
    data = {}
    expire = {}
    
    /**
     * 
     * @returns {Promise.<any>}
     */
    initalize = () => Promise.resolve()

    /**
     * 
     * @param {string} namespace 
     * @param {string} key 
     * @param {any} value
     * @returns {Promise.<any>} 
     */
    save(namespace, key, value) {
        this.checkNamespace(namespace)
        this.checkLife(namespace, key)
        this.data[namespace][key] = value
        return Promise.resolve()
    }

    /**
     * 
     * @param {string} namespace 
     * @param {string} key 
     * @returns {Promise.<any>}
     */
    get(namespace, key) {
        this.checkNamespace(namespace)
        this.checkLife(namespace, key)
        return Promise.resolve(this.data[namespace][key] || null)
    }

    /**
     * 
     * @param {string} namespace
     * @returns {Promise.<object>} 
     */
    getAll(namespace) {
        this.checkNamespace(namespace)
        this.checkLife(namespace)
        return Promise.resolve(this.data[namespace])
    }

    /**
     * 
     * @param {string} namespace 
     * @param {string} key
     * @returns {Promise.<boolean>} 
     */
    exist(namespace, key) {
        this.checkNamespace(namespace)
        this.checkLife(namespace, key)
        return Promise.resolve(typeof this.data[namespace][key] !== 'undefined')
    }

    /**
     * 
     * @param {string} namespace 
     * @param {string} key
     * @param {number} timeMs
     * @returns {Promise.<any>} 
     */
    expire(namespace, key, timeMs) {
        this.checkNamespace(namespace)
        this.checkLife(namespace, key)
        if (typeof this.data[namespace][key] !== 'undefined') {
            this.expire[namespace][key] = { set: new Date().getTime(), timeMs }
        }
        return Promise.resolve()
    }

    /**
     * 
     * @param {string} namespace 
     * @param {string} key
     * @returns {Promise.<number|null>} 
     */
    ttl(namespace, key) {
        this.checkNamespace(namespace)
        this.checkLife(namespace, key)
        const expireAt = this.expire[namespace][key]
        if (typeof expireAt === 'undefined') {
            return Promise.resolve(null)
        }
        const { set, timeMs } = expireAt
        const current = new Date().getTime()
        return Promise.resolve((set + timeMs) - current)
    }

    /**
     * 
     * @param {string} namespace 
     * @param {string} key
     * @returns {Promise.<any>} 
     */
    persist(namespace, key) {
        this.checkNamespace(namespace)
        this.checkLife(namespace, key)
        if (typeof this.expire[namespace][key] !== 'undefined') {
            delete this.expire[namespace][key]
        }
        return Promise.resolve()
    }

    /**
     * 
     * @param {string} namespace 
     * @param {string} key
     * @returns {Promise.<any>} 
     */
    delete(namespace, key) {
        this.checkNamespace(namespace)
        this.checkLife(namespace, key)
        delete this.data[namespace][key]
        return Promise.resolve()
    }

    /**
     * 
     * @param {string} namespace 
     * @returns {Promise.<any>} 
     */
    clear(namespace) {
        this.checkNamespace(namespace)
        this.data[namespace] = {}
        this.expire[namespace] = {}
        return Promise.resolve()
    }
    
    checkNamespace(namespace) {
        if (typeof this.data[namespace] === 'undefined') {
            this.data[namespace] = {}
            this.expire[namespace] = {}
        }
    }

    /**
     * @private
     * @param {string} key
     * @returns {number|null} 
     */
    checkLife(namespace, key = null) {
        const keyList = key === null ? [key] : Object.keys(this.expire[namespace])
        const currentTime = new Date().getTime()
        for (let key of keyList) {
            console.log(this.expire[namespace][key], key, namespace)
            const { set, timeMs } = this.expire[namespace][key] || {}
            if (set + timeMs <= currentTime) {
                delete this.data[namespace][key]
                delete this.expire[namespace][key]
            }
        }
    }
}

export default InMemoryKVStorageAdapter