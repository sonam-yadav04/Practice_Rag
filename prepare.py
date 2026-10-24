from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core import documents
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
file_path = "WhatsInItForMe.pdf"

loader  = PyPDFLoader(file_path)
docs = loader.load()
# print(f"Total pages: {len(docs)}")
# print("\nFirst page content:")

# for doc in docs:
#     print(doc.page_content)
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500,chunk_overlap=100)
# texts = text_splitter.split_text(docs[0].page_content)
chunks = text_splitter.split_documents(docs)

# print(f"Total chunks: {len(chunks)}")

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

vectorstore = FAISS.from_documents(chunks, embeddings)


# print(f"Total vectors in index: {vectorstore.index.ntotal}")

# for doc in results:
#     print(doc.page_content)
#     print("-" * 50)
# queries = [
#     "What is Unit 10 about?",
#     "Artificial Intelligence",
#     "What topics are covered in AI?",
#     "What is Min-Max Search?"
# ]

# for q in queries:
#     results = vectorstore.similarity_search(q, k=1)

#      print(f"\nQuestion: {q}")
#     print(results[0].page_content[:200])