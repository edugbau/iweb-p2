#!/usr/bin/env python3
"""Test MongoDB Atlas connection from Docker container"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from core.config import settings

async def test_connection():
    print(f"Testing connection to: {settings.mongo_uri[:50]}...")
    
    try:
        # Create client with certifi
        client = AsyncIOMotorClient(
            settings.mongo_uri,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=10000
        )
        
        # Test ping
        db = client[settings.database_name]
        result = await db.command('ping')
        print(f"✅ Ping successful: {result}")
        
        # Test write operation
        test_collection = db['test_connection']
        insert_result = await test_collection.insert_one({'test': 'data', 'timestamp': 'now'})
        print(f"✅ Write successful: inserted_id={insert_result.inserted_id}")
        
        # Clean up test document
        await test_collection.delete_one({'_id': insert_result.inserted_id})
        print("✅ Cleanup successful")
        
        client.close()
        print("\n🎉 All MongoDB operations successful!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_connection())
