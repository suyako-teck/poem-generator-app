from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import boto3
import os
from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy.orm import Session
from fastapi import Depends

# 環境変数の読み込み
load_dotenv()

app = FastAPI(title="ポエム生成API")

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv('FRONTEND_URL', 'http://localhost:3000')],
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

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

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
        # S3にアップロード
        bucket_name = os.getenv('AWS_S3_BUCKET')
        file_location = f"uploads/{file.filename}"
        
        s3_client.upload_fileobj(
            file.file,
            bucket_name,
            file_location
        )
        
        return {
            "filename": file.filename,
            "location": f"s3://{bucket_name}/{file_location}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/submit-character")
async def submit_character(character: CharacterInfo):
    # TODO: データベースへの保存処理を実装
    return {
        "message": "キャラクター情報が登録されました",
        "character": character
    }

@app.post("/generate-poem")
async def generate_poem(source: str, character_id: Optional[int] = None):
    try:
        if source == "image":
            # 画像からの生成ロジック
            prompt = "画像の雰囲気に合わせたポエムを生成してください"
        else:
            # キャラクター情報からの生成ロジック
            character = db.query(Character).filter(Character.id == character_id).first()
            prompt = f"キャラクター「{character.name}」の特徴を活かしたポエムを生成してください"

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        return {
            "message": "ポエムが生成されました",
            "poem": {
                "content": response.choices[0].message.content
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rate-poem")
async def rate_poem(poem_id: int, rating: str, db: Session = Depends(get_db)):
    try:
        new_rating = Rating(
            poem_id=poem_id,
            rating=rating
        )
        db.add(new_rating)
        db.commit()
        return {"message": "評価が保存されました"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 