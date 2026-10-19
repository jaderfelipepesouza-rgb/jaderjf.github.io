# Mérito: do zip ao APK instalado no celular

Arquivos do projeto (tudo na mesma pasta, sem subpastas):
index.html, manifest.webmanifest, sw.js, icon-192.png, icon-512.png, icon-maskable-512.png, .nojekyll

O app salva automaticamente no aparelho, a cada toque. Não precisa de botão de salvar.

IMPORTANTE: o arquivo .nojekyll começa com ponto e pode ficar escondido. Se não aparecer na pasta, ative "mostrar arquivos ocultos". Ele é necessário para o passo 4.

---------------------------------------------------------------
PARTE 1: Colocar o app na internet (GitHub Pages)
---------------------------------------------------------------
O PWABuilder precisa de um link público (https) do seu app. O GitHub Pages dá esse link de graça.

1. Acesse github.com e crie uma conta (se ainda não tiver).
2. Toque em "+" (canto superior) > New repository.
3. Em Repository name, digite: SEUUSUARIO.github.io
   (troque SEUUSUARIO pelo seu nome de usuário do GitHub, tudo minúsculo).
4. Marque "Public" e toque em Create repository.
5. Na página do repositório, toque em "uploading an existing file".
6. Descompacte o meus-tokens-pwa.zip no computador e arraste TODOS os arquivos para a página
   (inclusive o .nojekyll).
7. Toque em Commit changes.
8. Vá em Settings > Pages. Em "Build and deployment", escolha:
   Source: Deploy from a branch | Branch: main | Folder: / (root). Toque em Save.
9. Espere de 1 a 3 minutos e abra: https://SEUUSUARIO.github.io
   Se o app abrir, deu certo.

---------------------------------------------------------------
PARTE 2: Testar como app instalado (sem APK, 1 minuto)
---------------------------------------------------------------
1. No celular Android, abra o link no Chrome.
2. Menu (3 pontinhos) > "Instalar app" (ou "Adicionar à tela inicial").
3. O app aparece com ícone e abre em tela cheia. Teste tudo aqui antes de gerar o APK.

---------------------------------------------------------------
PARTE 3: Gerar o APK (PWABuilder)
---------------------------------------------------------------
Faça no computador (mais fácil).

1. Abra pwabuilder.com.
2. Cole https://SEUUSUARIO.github.io e clique em Start.
3. Espere a análise. Clique em "Package for stores".
4. Escolha Android e clique em Generate Package (ou Options).
5. Preencha as opções:
   - Package ID: com.jaderfelipe.merito
   - App name: Mérito
   - Short name: Mérito
   - App version: 1.0.0 (version code: 1)
   - Signing key: escolha "New" (ele cria uma chave para você)
   Deixe o restante no padrão.
6. Clique em Generate e depois em Download. Vem um arquivo .zip.
7. Abra esse .zip. Dentro há:
   - o arquivo .apk (é o que você instala no celular);
   - um arquivo .aab (só serve para publicar na Google Play, pode ignorar);
   - a chave de assinatura (.keystore) e um arquivo com as senhas;
   - o arquivo assetlinks.json (usado na Parte 4).
8. GUARDE a chave (.keystore) e as senhas em local seguro (Google Drive, por exemplo).
   Sem elas você não consegue gerar atualizações do mesmo app depois.

---------------------------------------------------------------
PARTE 4: Tirar a barra de endereço do Chrome do APK
---------------------------------------------------------------
Sem este passo o APK instala e funciona, mas pode mostrar uma barra do Chrome no topo.

1. Abra o arquivo assetlinks.json do zip do PWABuilder e copie o conteúdo.
2. No GitHub, no repositório SEUUSUARIO.github.io, toque em Add file > Create new file.
3. No campo do nome, digite exatamente: .well-known/assetlinks.json
   (ao digitar a barra "/", o GitHub cria a pasta).
4. Cole o conteúdo e toque em Commit changes.
5. Confira abrindo no navegador: https://SEUUSUARIO.github.io/.well-known/assetlinks.json
   Deve aparecer o texto do arquivo.
6. Desinstale o APK (se já instalou) e instale de novo (Parte 5).
   A verificação pode levar alguns minutos para valer.

---------------------------------------------------------------
PARTE 5: Instalar o APK no celular Android
---------------------------------------------------------------
1. Passe o arquivo .apk para o celular: cabo USB, Google Drive, e-mail ou WhatsApp (mandando para você mesmo).
2. No celular, abra o arquivo .apk (pelo app Arquivos ou pelo app onde baixou).
3. Se o Android avisar "Por segurança, o telefone não permite instalar apps desconhecidos desta fonte":
   toque em Configurações e ative "Permitir desta fonte" para o app que você está usando (Arquivos, Drive, Chrome etc.).
4. Volte e toque em Instalar.
5. Se o Google Play Protect avisar que o app não é reconhecido, toque em "Mais detalhes" > "Instalar mesmo assim".
   É o seu próprio app.
6. Abra "Mérito" pelo ícone dourado.

---------------------------------------------------------------
Atualizar o app depois
---------------------------------------------------------------
Troque o index.html no repositório (Add file > Upload files). O app instalado puxa a versão nova
quando abrir com internet. Não precisa gerar o APK de novo.

---------------------------------------------------------------
Cuidados com os dados
---------------------------------------------------------------
- Os dados ficam só neste aparelho. Se desinstalar o app ou limpar os dados dele, o saldo some.
- Em Regras > Exportar backup, baixe um arquivo de backup de vez em quando e guarde no Drive.
- Para trocar de celular: instale o app no novo e use Regras > Importar backup.
- O app instalado pelo APK e o aberto no Chrome guardam dados separados. Use só um dos dois.

---------------------------------------------------------------
Problemas comuns
---------------------------------------------------------------
- Link do GitHub dá erro 404: espere 3 minutos, confirme que o index.html está na raiz do repositório
  e que o Pages está ativado (Parte 1, passo 8).
- PWABuilder reclama que não achou o manifest: confirme que manifest.webmanifest e sw.js estão na raiz.
- APK abre com barra de endereço: faça a Parte 4 e reinstale.
- Fontes diferentes no primeiro uso: as fontes carregam da internet na primeira abertura e depois ficam guardadas.
