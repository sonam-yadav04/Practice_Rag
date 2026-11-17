from functools import lru_cache

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from backend.ingestion.ingest import BASE_DIR, load_and_chunk

CHROMA_DIR = str(BASE_DIR / "chroma_db")
COLLECTION_NAME = "whats_in_it_for_me"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_embeddings():
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)


def build_vectorstore():
    """Chunk the PDF, embed the chunks, and save them to Chroma."""
    chunks = load_and_chunk()
    return Chroma.from_documents(
        documents=chunks,
        embedding=get_embeddings(),
        collection_name=COLLECTION_NAME,
        persist_directory=CHROMA_DIR,
    )


def load_vectorstore():
    """Open the saved DB without re-embedding."""
    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=get_embeddings(),
        persist_directory=CHROMA_DIR,
    )


def get_vectorstore():
    """Return the DB, building it first only if it's empty."""
    store = load_vectorstore()
    if store._collection.count() == 0:
        print("Vector DB empty, building it...")
        store = build_vectorstore()
    return store