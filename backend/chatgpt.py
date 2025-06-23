import ollama
import google.generativeai as genaiChat
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import base64
import requests


genaiChat.configure(api_key="")
cliend_id_unsplash = ""

coleta_chat = genaiChat.GenerativeModel(
    model_name="gemini-2.0-flash",
    system_instruction='''
        Você é um assistente de coleta de informações para geração de sites. Sua tarefa é extrair informações relevantes do usuário para criar um site personalizado. Você deve fazer perguntas específicas e detalhadas para entender as necessidades do usuário, como o tipo de site, o público-alvo, as funcionalidades desejadas, preferências de design, etc.
        Faça uma pergunta de cada vez e aguarde a resposta do usuário antes de prosseguir para a próxima pergunta. Se o usuário fornecer uma resposta vaga ou incompleta, faça perguntas adicionais para esclarecer as informações.
        Não ultrapasse 6 perguntas no total, mas certifique-se de coletar informações suficientes para criar um site relevante e personalizado. Se necessário, faça perguntas adicionais para obter mais detalhes ou esclarecer dúvidas.
        Aqui algumas das peguntas que você pode fazer:
        Qual é o nome do seu produto, serviço ou negócio?
        Qual é o principal objetivo da página inicial do site? (ex: vender produtos, fornecer informações, capturar leads, etc)
        Quem é o público-alvo do site? (ex: jovens, profissionais, empresas, etc)
        Quais são as principais funcionalidades que você gostaria de incluir no site? (ex: formulário de contato, galeria de imagens, blog, etc)
        Você tem alguma preferência de estilo ou design? (ex: minimalista, moderno, colorido, etc)
        Você tem alguma cor ou paleta de cores específica em mente?
        Você tem algum site de referência que você gosta e gostaria de se inspirar?

        Quando o usuário responder, você deve coletar as informações e retornar um resumo claro e conciso do que foi discutido, incluindo os principais pontos e decisões tomadas. Se necessário, faça perguntas adicionais para esclarecer dúvidas ou obter mais detalhes.
        Assim que tudo for coletado você deve retornar um prompt com o seguinte formato:
        Estado do prompt: Finalizado
        Prompt: [O prompt completo para geração do site, incluindo todas as informações coletadas e requisitos específicos]
        Lembre-se de que o objetivo é coletar informações suficientes para criar um site personalizado e relevante para o usuário, então seja detalhista e específico em suas perguntas.
        ''').start_chat()

chat = genaiChat.GenerativeModel(
    model_name="gemini-2.0-flash",
    system_instruction='''
        Fazer a estilização sempre ficar semelhante a imagem de referência enviada.
        Não copie o texto da imagem, apenas use como referência para o design.
        Incorporar o CSS diretamente no HTML, dentro da tag <style>, mantendo o arquivo autocontido.
        Utilizar javascript directamente no HTML, dentro da tag <script>, mantendo o arquivo autocontido.
        Lembre-se que o rodapé deve estar fixo na parte inferior da página, mesmo que o conteúdo não ocupe toda a altura da tela.
        Será enviado uma lista de links de imagens, você deve utilizar imagens dessa lista para gerar o site.
        '''
        ).start_chat()


def chat_coleta(prompt: str) -> str:
    try:
        response = coleta_chat.send_message(prompt, stream=False)
        print(response.text)
        if("Estado do prompt" in response.text and "Prompt" in response.text):
            return chat_with_genai(response.text.split("Prompt: ")[1].strip())
        return {
            "role": "assistant",
            "content": response.text
        }
    except Exception as e:
        print(f"Error during chat collection: {e}")
        return {
            "role": "assistant",
            "content": "An error occurred while collecting information for the website."
        }



def chat_with_genai(prompt: str) -> str:


    chat_improved_prompt = genaiChat.GenerativeModel(
    model_name="gemini-2.0-flash",
    system_instruction="Será enviado um prompt para gerar um website com certas caracteristas você deve extrair sobre o que será o site se será um petshop, um marketplace. Uma vez extraido monte um conjunto de palavras-chave sobre o tema em ingles como: petshop, dogs, cats. Retorne apenas as palavras chaves nada mais. As palavras chaves não devem incluir nada relacionado ao estilo do website ou cores somente sobre o tema.").start_chat()
    key_words = chat_improved_prompt.send_message(prompt, stream=False).text
    links = request_images_unsplash(key_words, 1, 10)
    generate_image(prompt)
    print(f"Improved prompt: {key_words}")

    uploaded_file = genaiChat.upload_file("gemini-2.0-flash-preview-image-generation.png")
    prompt_final = (
    prompt
    + ". Siga a estilização da imagem anexada de referência enviada.\n\n"
    + "Links das imagens de referência:\n"
    + "\n".join(f"- URL: {link['url']} (Size: {link['size']}) Slug: {link['slug']})" for link in links)
)


    response = chat.send_message([prompt_final, uploaded_file], stream=False)
    
    print(response.text)
    return {
        "role": "assistant",
        "content": response.text
    }

def request_images_unsplash(query, page=1, per_page=10):
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "page": page,
        "per_page": per_page,
        "client_id": cliend_id_unsplash
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return [
            {
                "url": result['urls']['regular'],
                "size": f"{result['width']}x{result['height']}",
                "slug": result['slug'] if 'slug' in result else None
            } for result in response.json().get('results', [])
        ]
    else:
        response.raise_for_status()



def generate_image(prompt: str) -> str:
    client = genai.Client(api_key="")

    contents = ("Gere a imagem de um landing page de um website com as seguintes carateristicas: " + prompt + ". Lembrando que deve ser uma imagem de um website, não uma imagem de um produto ou serviço. A imagem deve ser inspirada em sites famosos e modernos, como Apple, Google, Airbnb, Medium, etc.")

    response = client.models.generate_content(
        model="gemini-2.0-flash-preview-image-generation",
        contents=contents,
        config=types.GenerateContentConfig(
        response_modalities=['TEXT', 'IMAGE']
        )
    )

    for part in response.candidates[0].content.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = Image.open(BytesIO((part.inline_data.data)))
            image.save('gemini-2.0-flash-preview-image-generation.png')


def chatWithAI(prompt: str) -> str:
    try:
        response = ollama.chat(
            model="llama3.1",
            messages=[
                {
                "role": "system",
                "content": '''Você é um designer de frontend altamente experiente, especializado na criação de páginas web utilizando exclusivamente HTML e CSS embutido (sem frameworks ou bibliotecas externas). Seu objetivo é gerar páginas limpas, bem estruturadas e visualmente atrativas, seguindo as melhores práticas de design e codificação.

Você sempre deve:

Produzir código organizado, semântico e legível.

Incorporar o CSS diretamente no HTML, dentro da tag <style>, mantendo o arquivo autocontido.

Adaptar o layout, paleta de cores, tipografia e estilo visual com base nas preferências informadas pelo cliente (ex: minimalista, retrô, moderno, dark mode, etc).

Priorizar estética limpa, com bom uso de espaçamento, alinhamento, hierarquia visual e tipografia.

Garantir que o design funcione bem em diferentes tamanhos de tela, mesmo que de forma básica (sem media queries complexas, a menos que solicitado).

Nunca utilizar JavaScript, bibliotecas ou recursos externos, salvo quando explicitamente permitido pelo cliente.


Você é criativo, mas disciplinado. Seu estilo padrão é moderno e sóbrio, mas você se adapta a qualquer estilo conforme solicitado. Seu código deve ser pronto para uso direto em produção. Quando gerar o HTML, inclua todo o código necessário para que a página funcione como um exemplo completo, com título, cabeçalho, conteúdo e estilo visual correspondente ao pedido.'''
                },
                {
                "role": "user", 
                "content": prompt
                }],
            stream=False
        )
        return response['message']
    except Exception as e:
        print(f"Error during chat with AI: {e}")
        return "An error occurred while communicating with the AI."
    