from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import boto3
import os
from dotenv import load_dotenv
import requests

# 環境変数の読み込み
load_dotenv()

app = FastAPI(title="ポエム生成API")

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv('FRONTEND_URL', 'http://localhost:3000'),
        'https://poemgenerator-fx25s3x99-suyako-tecks-projects.vercel.app',
        'https://poem-generator-app.vercel.app'
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["*"],
)

# S3クライアントの設定
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

# Hugging Face APIの設定
HF_API_URL = "https://api-inference.huggingface.co/models/cyberagent/open-calm-7b"
HF_API_KEY = os.getenv('HUGGINGFACE_API_KEY')

def generate_text(prompt: str) -> str:
    if not HF_API_KEY:
        raise HTTPException(status_code=500, detail="Hugging Face API is not configured")
    
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    
    # プロンプトの最適化
    system_prompt = "あなたは詩人です。以下の条件に基づいて、美しいポエムを生成してください。"
    full_prompt = f"{system_prompt}\n\n条件：{prompt}\n\nポエム："
    
    payload = {
        "inputs": full_prompt,
        "parameters": {
            "max_length": 120,
            "temperature": 0.8,
            "top_p": 0.95,
            "repetition_penalty": 1.2,
            "do_sample": True
        }
    }
    
    response = requests.post(HF_API_URL, headers=headers, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to generate text")
    
    return response.json()[0]["generated_text"]

class CharacterInfo(BaseModel):
    name: str
    work: str
    traits: str
    quotes: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "ポエム生成APIへようこそ"}

@app.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    try:
        # AWS認証情報のチェック
        if not all([
            os.getenv('AWS_ACCESS_KEY_ID'),
            os.getenv('AWS_SECRET_ACCESS_KEY'),
            os.getenv('AWS_S3_BUCKET')
        ]):
            raise HTTPException(
                status_code=500,
                detail="AWS credentials are not properly configured"
            )

        # S3にアップロード
        bucket_name = os.getenv('AWS_S3_BUCKET')
        file_location = f"uploads/{file.filename}"
        
        try:
            s3_client.upload_fileobj(
                file.file,
                bucket_name,
                file_location
            )
        except Exception as s3_error:
            raise HTTPException(
                status_code=500,
                detail=f"S3 upload failed: {str(s3_error)}"
            )
        
        return {
            "filename": file.filename,
            "location": f"s3://{bucket_name}/{file_location}"
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )

@app.post("/submit-character")
async def submit_character(character: CharacterInfo):
    return {
        "message": "キャラクター情報が登録されました",
        "character": character
    }

@app.post("/generate-poem")
async def generate_poem(source: str, character_id: Optional[int] = None):
    try:
        if source == "image":
            # 画像からの生成ロジック
            prompt = "画像から感じられる雰囲気や感情を表現した、叙情的なポエムを生成してください。"
        else:
            # キャラクター情報からの生成ロジック
            prompt = f"キャラクターの特徴を活かし、その世界観を表現したポエムを生成してください。"

        generated_text = generate_text(prompt)
        
        return {
            "message": "ポエムが生成されました",
            "poem": {
                "content": generated_text
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 