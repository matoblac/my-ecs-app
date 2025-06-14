// src/infrastructure/database/aurora/AuroraDataSource.ts
import {
    RDSDataClient,
    ExecuteStatementCommand,
    BeginTransactionCommand,
    CommitTransactionCommand,
    RollbackTransactionCommand,
    ExecuteStatementCommandInput,
    Field
  } from '@aws-sdk/client-rds-data'
  
  export class AuroraDataSource {
    private client: RDSDataClient
    private clusterArn: string
    private secretArn: string
    private dbName: string
  
    constructor() {
      this.clusterArn = process.env.DB_CLUSTER_ARN!
      this.secretArn = process.env.DB_SECRET_ARN!
      this.dbName = process.env.DB_NAME || 'AllenAIDB'
  
      this.client = new RDSDataClient({ region: process.env.AWS_REGION || 'us-east-1' })
    }
  
    async execute(
      sql: string,
      parameters: ExecuteStatementCommandInput['parameters'] = [],
      transactionId?: string
    ) {
      const command = new ExecuteStatementCommand({
        secretArn: this.secretArn,
        resourceArn: this.clusterArn,
        sql,
        database: this.dbName,
        parameters,
        includeResultMetadata: true,
        ...(transactionId ? { transactionId } : {})
      })
  
      return this.client.send(command)
    }
  
    async beginTransaction(): Promise<string> {
      const result = await this.client.send(
        new BeginTransactionCommand({
          resourceArn: this.clusterArn,
          secretArn: this.secretArn,
          database: this.dbName
        })
      )
      return result.transactionId!
    }
  
    async commitTransaction(transactionId: string): Promise<void> {
      await this.client.send(
        new CommitTransactionCommand({
          resourceArn: this.clusterArn,
          secretArn: this.secretArn,
          transactionId
        })
      )
    }
  
    async rollbackTransaction(transactionId: string): Promise<void> {
      await this.client.send(
        new RollbackTransactionCommand({
          resourceArn: this.clusterArn,
          secretArn: this.secretArn,
          transactionId
        })
      )
    }
  
    static getFieldValue(field: Field): any {
      if ('stringValue' in field) return field.stringValue
      if ('booleanValue' in field) return field.booleanValue
      if ('longValue' in field) return field.longValue
      if ('doubleValue' in field) return field.doubleValue
      if ('blobValue' in field) return field.blobValue
      return null
    }
  }
  