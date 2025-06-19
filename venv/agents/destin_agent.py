from agents.base_agent import BaseAgent
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings

ALLOWED_COUNTRIES = [
    "uk", "norway", "croatia", "italy", "malta", "spain", "portugal",
    "austria", "belgium", "france", "germany", "liechtenstein", "luxembourg",
    "netherlands", "monaco", "switzerland"
]

class DestinationAgent(BaseAgent):
    def __init__(self, pdf_path):
        super().__init__(
            name="DestinationExpert",
            description="Provides contextual travel insights with conversation history",
            avatar="travel_avatar.png"
        )
        self.allowed_countries = ALLOWED_COUNTRIES
        self.pdf_path = pdf_path
        self.embedding_function = OllamaEmbeddings(model="nomic-embed-text")
        if not os.path.exists("chroma_db"):
            os.makedirs("chroma_db")
        
        self.vector_store = Chroma(
            persist_directory="chroma_db",
            embedding_function=self.embedding_function,
            collection_name="destination_docs" 
        )
        self.load_all_pdfs()  # Preload PDFs on initialization
        print('initialization finished')

    def load_all_pdfs(self):
        """Preload all PDFs into vector store at initialization"""
        if os.path.exists(self.pdf_path):
            for fname in os.listdir(self.pdf_path):
                if fname.lower().endswith('.pdf'):
                    loader = PyPDFLoader(os.path.join(self.pdf_path, fname))
                    docs = loader.load_and_split()
                    self.vector_store.add_documents(docs)

    def get_relevant_documents(self, query, history=None):
        """Enhanced retrieval with follow-up handling"""
        if self.is_followup(query, history):
            return self.vector_store.max_marginal_relevance_search(
                query, 
                k=5,
                filter={'source': self.get_current_source(history)}
            )
        return self.vector_store.similarity_search(query, k=3)

    def is_followup(self, query, history):
        """Detect follow-up questions using linguistic cues"""
        if not history:
            return False
        return any(word in query.lower() for word in 
                 ['they', 'it', 'there', 'that', 'those', 'more', 'how about'])

    def get_current_source(self, history):
        """Extract source document from previous context"""
        return history[-1].get('source', '') if history else ''

    def query_pdf(self, destination, history=None, query=None):
        """Modified PDF query with contextual awareness"""
        pdf_context = "\n".join([
            doc.page_content for doc in self.get_relevant_documents(query, history)
        ])
        
        prompt = self.build_contextual_prompt(
            destination=destination,
            context=pdf_context,
            history=history,
            query=query
        )
        
        return self.get_response(prompt)

    def build_contextual_prompt(self, destination, context, history, query):
        """Create conversation-aware prompt template"""
        return f"""
        **Conversation Context**
        Previous discussion: {self.summarize_history(history)}
        Current focus: {query or destination}

        **Document Context**
        {context if context else "No specific location context available"}

        **Response Requirements**
        - Address follow-up aspects from conversation history
        - Highlight new information not previously mentioned
        - Maintain natural flow with previous exchanges
        - Include emojis relevant to key points
        """
    
    def summarize_history(self, history):
        """Extract key entities from conversation history"""
        return ", ".join([h.get('user', '') for h in history[-2:]]) if history else "New conversation"

    # Rest of original methods remain unchanged below this point
    # [Previous greet(), is_valid_destination(), get_destination_insights() methods]


'''
    def greet(self, interest_type=None):
        if interest_type == "culture":
            return self.get_response(
                "Generate a suggestion of european countries for travelers interested in exploring culture/history/arts."
            )
        elif interest_type == "food":
            return self.get_response(
                "Generate a suggestion of european countries for travelers interested in exploring food/culinary/eating."
            )
        else:
            return self.get_response(
                "Generate a suggestion of european countries for travelers interested in exploring nature/hiking."
            )
        

    def get_destination_insights(self, destination):
        #if not self.is_valid_destination(destination):  
        #    return f"Sorry, I can only provide information about these countries: {', '.join(self.allowed_countries)}."
        
        pdf_context = self.query_pdf(destination)
        
        prompt = f"""
        **Local Guide Context:**
        {pdf_context if pdf_context else "No local info available"}
        Conversation History {history}
        **Your Task:**
        Provide brief insights about {destination} including:
        - Cultural/historical context of the country
        - A brief interesting historical fact/story about the country
        - List the best cities/attractions to visit
        - What types of travelers would love this country
        - When best to visit 
        
        Format with markdown headers, bullet points, and emojis.
        Italicize info that are written using local pdf context
        Ask user to provide more detailed preferences so can give more specific recommendations about how to travel in this country.
        """
        return self.get_response(prompt)
'''