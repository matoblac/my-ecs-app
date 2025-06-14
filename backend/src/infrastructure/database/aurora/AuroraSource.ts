// src/infrastructure/database/aurora/AuroraSource.ts
import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data'

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

  // The main SQL execution entry point
  async execute(sql: string, parameters: any[] = []) {
    const command = new ExecuteStatementCommand({
      secretArn: this.secretArn,
      resourceArn: this.clusterArn,
      sql,
      database: this.dbName,
      parameters,
      includeResultMetadata: true
    })
    return this.client.send(command)
  }

  // Safe field extraction from RDS Data API records
  static getFieldValue(field: any): any {
    if (!field) return undefined
    if ('stringValue' in field) return field.stringValue
    if ('booleanValue' in field) return field.booleanValue
    if ('longValue' in field) return field.longValue
    if ('doubleValue' in field) return field.doubleValue
    if ('blobValue' in field) return field.blobValue
    return null
  }
}