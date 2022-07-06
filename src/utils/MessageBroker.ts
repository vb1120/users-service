// imports
import * as amqp from 'amqplib'
import { Connection, Channel } from 'amqplib'
import { envs } from './envs'

const { rabbitmqUri } = envs

/**
 * Broker for async messaging
 * Singleton class
 */
export class MessageBroker {
    // declare class properties
    public connection!: Connection
    public channel!: Channel
    private static instance: MessageBroker

    /**
     * Initialize connection to rabbitMQ
     */
    private async init() {
        this.connection = await amqp.connect(rabbitmqUri)
        this.channel = await this.connection.createChannel()
        return this
    }

    /**
     * This method sends message to connected application listening on this queue
     * @param queue Queue to be sended with name
     * @param msg Message to be sended in buffer form
     */
    public async send(
        queue: string,
        msg: Buffer,
        options?: amqp.Options.Publish | undefined
    ) {
        await this.channel.assertQueue(queue, { durable: true })

        return this.channel.sendToQueue(queue, msg, options)
    }

    /**
     * This method used to close rabbitmq connection
     */
    public async close() {
        if (!this.connection) {
            await this.init()
        }
        await this.connection.close()
    }

    /**
     * This method for getting message broker instance
     * @returns Singleton instance of Message Broker
     */
    public static async getInstance() {
        if (!MessageBroker.instance) {
            const broker = new MessageBroker()
            MessageBroker.instance = await broker.init()
        }
        return MessageBroker.instance
    }
}
