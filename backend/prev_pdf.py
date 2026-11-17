from backend.ingestion.ingest import load_documents , chunck_documents

docs = load_documents()
print(f"Total pages: {len(docs)}\n")

for doc in docs:
    print("PAGE:", doc.metadata.get("page"), "| source:", doc.metadata.get("source"))
    print(doc.page_content)

chuncks = chunck_documents(docs)

print(f"\nTotal chunks: {len(chuncks)}\n")
for i , chunck in enumerate(chuncks):
    print(f"CHUNK {i+1} | source: {chunck.metadata.get('source')}")
    print(chunck.page_content)    