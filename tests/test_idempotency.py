import asyncio
import httpx
import uuid
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load backend environment variables
load_dotenv("/app/backend/.env")

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "test_database")
BACKEND_URL = "http://localhost:8001/api"

async def test_idempotency_key_e2e():
    print("Starting Idempotency-Key E2E Test...")
    
    # 1. Initialize MongoDB client
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # 2. Generate unique idempotency key and session ID
    idem_key = f"test-idem-key-{uuid.uuid4()}"
    session_id = f"test-sess-{uuid.uuid4()}"
    
    # Payload requesting product purchase to trigger "mau_pesan" intent
    payload = {
        "message": "Mau pesan 1 Kopi Susu Gula Aren 1L",
        "session_id": session_id,
        "history": []
    }
    
    async with httpx.AsyncClient() as ac:
        # --- First Call ---
        print(f"Sending first request with Idempotency-Key: {idem_key}")
        resp1 = await ac.post(
            f"{BACKEND_URL}/agent/chat",
            json=payload,
            headers={"Idempotency-Key": idem_key},
            timeout=30.0
        )
        
        if resp1.status_code != 200:
            print(f"ERROR: First request failed with status {resp1.status_code}: {resp1.text}")
            client.close()
            sys.exit(1)
            
        data1 = resp1.json()
        print("First request successful!")
        
        approval1 = data1.get("approval")
        if not approval1:
            print("ERROR: First request did not generate an approval. Please verify intent/SKU/stock.")
            client.close()
            sys.exit(1)
            
        appv1_id = approval1["id"]
        trace1_id = data1["trace_id"]
        print(f"Generated Approval ID: {appv1_id}, Trace ID: {trace1_id}")
        
        # Verify approval exists in MongoDB
        appv_in_db = await db.approvals.find_one({"id": appv1_id})
        if not appv_in_db:
            print("ERROR: Approval was not stored in MongoDB!")
            client.close()
            sys.exit(1)
        print("Approval successfully verified in MongoDB.")
        
        # --- Second Call with SAME Idempotency-Key ---
        print(f"Sending second request with identical Idempotency-Key: {idem_key}")
        resp2 = await ac.post(
            f"{BACKEND_URL}/agent/chat",
            json=payload,
            headers={"Idempotency-Key": idem_key},
            timeout=30.0
        )
        
        if resp2.status_code != 200:
            print(f"ERROR: Second request failed with status {resp2.status_code}: {resp2.text}")
            client.close()
            sys.exit(1)
            
        data2 = resp2.json()
        print("Second request successful!")
        
        approval2 = data2.get("approval")
        if not approval2:
            print("ERROR: Second request returned empty approval!")
            client.close()
            sys.exit(1)
            
        appv2_id = approval2["id"]
        trace2_id = data2["trace_id"]
        print(f"Returned Approval ID from cached response: {appv2_id}, Trace ID: {trace2_id}")
        
        # --- IDEMPOTENCY VERIFICATIONS ---
        assert appv1_id == appv2_id, "Approval IDs MUST be identical!"
        assert trace1_id == trace2_id, "Trace IDs MUST be identical!"
        assert data1["reply"] == data2["reply"], "Replies MUST be identical!"
        print("SUCCESS: Idempotency matches exactly between first and second responses!")
        
        # Check that we still only have 1 approval document in MongoDB (no duplicate created)
        db_count = await db.approvals.count_documents({"id": appv1_id})
        assert db_count == 1, f"Expected 1 approval document in DB, found {db_count}!"
        print("SUCCESS: MongoDB database does not have duplicate approvals.")
        
        # --- Third Call with DIFFERENT Idempotency-Key ---
        new_idem_key = f"test-idem-key-{uuid.uuid4()}"
        print(f"Sending third request with a DIFFERENT Idempotency-Key: {new_idem_key}")
        resp3 = await ac.post(
            f"{BACKEND_URL}/agent/chat",
            json=payload,
            headers={"Idempotency-Key": new_idem_key},
            timeout=30.0
        )
        
        if resp3.status_code != 200:
            print(f"ERROR: Third request failed with status {resp3.status_code}: {resp3.text}")
            client.close()
            sys.exit(1)
            
        data3 = resp3.json()
        print("Third request successful!")
        
        approval3 = data3.get("approval")
        if not approval3:
            print("ERROR: Third request returned empty approval!")
            client.close()
            sys.exit(1)
            
        appv3_id = approval3["id"]
        trace3_id = data3["trace_id"]
        print(f"Generated NEW Approval ID: {appv3_id}, Trace ID: {trace3_id}")
        
        assert appv1_id != appv3_id, "New request with different idempotency key MUST generate a new approval!"
        assert trace1_id != trace3_id, "New request with different idempotency key MUST generate a new trace!"
        print("SUCCESS: Different idempotency key generates new and distinct approval and trace.")
        
    client.close()
    print("All E2E Idempotency-Key tests PASSED successfully!")

if __name__ == "__main__":
    asyncio.run(test_idempotency_key_e2e())