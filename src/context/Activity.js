import Context from './Context'
import Actor from './Actor'
/**
 * Callback for handling actions
 *
 * @callback ActionListener
 * @param {Action} action
 * @param {Actor} actor
 * @param {Context} context
 * @returns {Promise.<any>}
 */

class Activity {

    /**
     * 
     * @private
     * @type {RegExp}
     */
    nameRegExp = new RegExp(/^[a-z0-9]+$/)

    /**
     * 
     * @private
     * @type {Map.<string,Activity>}
     */
    activities = null

    /**
     * 
     * @private
     * @type {Map.<string,ActionListener>}
     */
    listeners = null

    constructor() {
        this.activities = new Map()
        this.listeners = new Map()
    }

    /**
     * 
     * @param {string} name 
     * @param {Activity} activity 
     */
    use(namespace, activity) {
        this.validateNamespace(namespace)
        if (!(activity instanceof Activity)) {
            throw new Error('activity must be an instance of Activity class')
        }
        if (this.activities.has(namespace)) {
            throw new Error(`activity with name [${namespace}] is already registered`)
        }
        this.activities.set(namespace, activity)
    }

    /**
     * 
     * @param {string} name 
     * @param {ActionListener} actionListener 
     */
    on(namespace, actionListener) {
        this.validateNamespace(namespace)
        if (typeof actionListener !== 'function') {
            throw new Error('actionListener must be a function')
        }
        if (this.listeners.has(namespace)) {
            throw new Error(`listener with name [${namespace}] is already registered`)
        }
        this.listeners.set(namespace, actionListener)
    }

    validateNamespace(namespace) {
        if (!this.nameRegExp.test(namespace)) {
            throw new Error(`invalid activity namespace [${namespace}]`)
        }
    }
}

/**
 * 
 * @param {Activity} activity 
 * @param {string} namespace
 * @returns {ActionListener|null}
 */
Activity.getListener = (activity, namespace) => {
    let activities = namespace.split('.')
    if (activities.length === 1) {
        return activity.listeners.get(activities[0])
    } else {
        let childActivity = activity.activities.get(activities[0])
        if (childActivity) {
            activities.shift()
            return Activity.getListener(childActivity, activities.join('.'))
        }
        return null
    }
}

export default Activity