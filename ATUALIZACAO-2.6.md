# Mérito 2.6 — auditoria e entrega

Data: 21/10/2026. Evolução do projeto existente, sem recriação.

## Auditoria

O projeto original possui uma página HTML com estilos e JavaScript incorporados, manifesto, service worker e três ícones. Não usa bibliotecas de execução nem servidor de dados. As fontes Google são opcionais; sem internet, usa as fontes do sistema.

As cinco telas existentes são Resumo, Hoje, Prêmios, Histórico e Regras. Dados ficam no localStorage da origem, na chave `tokens_v1`. `actions` guarda tarefas e recorrências; `rewards` guarda recompensas; `log` guarda conclusões e movimentações no mesmo registro; `bal0` guarda o saldo inicial. Cada conclusão tem identificador `u`, referência de tarefa `id`, lançamento `t`, realização `rd` e valor `d`. Reversões apontam para `orig`. A chave antiga foi mantida.

Já existiam calendário, retroatividade, recorrências diárias/semanais, reversões, recompensas com descrição recolhível, categorias, arquivamento, confirmação de resgate, indicador de uso, exportação e importação. Foram preservados também escorregões, limite diário, coringa, meta mensal, áreas, ícones e identidade dourada. Penalidades continuam sendo exclusivamente ações manuais existentes.

Problemas encontrados: atributo malformado no botão Desfazer; validação de backup ignorando saldo inicial; falha de gravação sem reversão do estado na memória; leitura de JSON inválido podendo iniciar dados padrão sem proteção; histórico limitado a 80 registros sem paginação; mudanças de programação afetando consulta antiga; cache apagando caches alheios e misturando arquivos de versões; atualização manual apagando indiscriminadamente caches.

## Estratégia e alterações

1. Cópia integral do projeto original e desenvolvimento em cópia separada.
2. Saldo continua sendo `bal0 + soma(log.d)`. Reversões são novos lançamentos. Validação de referências, duplicatas, sinais, valores finitos, cadastros e checksum. Gravação do estado completo em uma única escrita localStorage; falhas restauram o último estado confirmado. Dados inválidos bloqueiam gravações e podem ser baixados em formato bruto para recuperação.
3. Alterações de nome, pontuação, dias, meta semanal e ativação criam versões da tarefa com vigência diária. Registros novos guardam a área por nome. Novas tarefas são inicialmente limitadas a uma conclusão por dia; tarefas antigas repetíveis continuam repetíveis. O bloqueio de toques rápidos foi preservado e estendido ao desfazimento rápido.
4. Resgates validam preço, saldo, ativação e arquivamento. Botão Desfazer corrigido. Cadastros e preços novos não alteram os lançamentos existentes.
5. Carteira com filtros de data de lançamento/tipo, paginação, identificação dos registros e totais válidos. Ajuste de saldo exige motivo e confirmação. Relatórios semanais/mensais apresentam ganhos, gastos, conclusões, comparação com trecho equivalente do período anterior, distribuição por área, dia com mais registros e frequência por tarefa. Preferência de tema e potencial diário acrescentados.
6. Backup JSON com versão, saldo inicial, versões das tarefas e configurações. Importação validada integralmente antes da substituição e com cópia anterior obrigatória. Sincronização de alterações gravadas entre abas e recusa de gravações sobre um estado alterado externamente.
7. Service worker instala todos os recursos essenciais juntos e mantém a versão instalada até fechar as janelas antigas. Remove somente caches do Mérito. Recursos externos não recebem HTML como fallback. Atualização manual apenas verifica nova versão e preserva os caches offline.

O esquema principal continua na versão 2, com campos opcionais adicionais; não houve migração para IndexedDB. Na primeira abertura, o JSON anterior é copiado para `tokens_v1_before_2_6`, sem sobrescrever cópia existente. Backups antigos de migração e de pré-importação continuam disponíveis. A cópia anterior fica no mesmo aparelho e não substitui backup externo.

## Testes executados

Chrome em modo headless, servidor HTTP local e perfis isolados, em 21/10/2026. Os seguintes 16 cenários passaram:

1. Inicialização e navegação nas cinco telas em 390px.
2. Registro retroativo, valor correto e limite de uma conclusão.
3. Desfazer pelo histórico, saldo corrigido e referência à movimentação original.
4. Consulta de pontuação/programação anterior à edição.
5. Falha simulada de escrita localStorage cancela a alteração na memória.
6. Backup com saldo inicial válido é aceito; valores inválidos e identificadores duplicados são recusados.
7. Resgate, preservação do preço efetivamente pago e estorno.
8. Resgate sem saldo não altera a carteira.
9. Conteúdo JSON gerado pela exportação é restaurado com saldo inicial correto.
10. Saldo persiste após recarregar, sem erros JavaScript nos fluxos anteriores.
11. Cinco telas sem transbordamento horizontal em 320px.
12. Reabertura offline e navegação com saldo preservado após instalação do service worker.
13. Importação de versão inválida preserva dados atuais.
14. Toques rápidos não duplicam crédito e meta semanal é respeitada.
15. Outra aba recebe alterações gravadas.
16. JSON corrompido na inicialização permanece intacto, com gravação bloqueada e opção de recuperação.

O navegador de teste cancelou a gravação de downloads em disco. O teste de exportação verificou o conteúdo do Blob efetivamente gerado pelo botão e o restaurou pela entrada de arquivo; não comprova o salvamento pelo gerenciador de downloads de um celular.

## Limites e trabalho futuro

- Testes em celular físico, teclado/leitor de tela completos, APK e atualização real da versão instalada anteriormente ainda precisam de validação no dispositivo. O teste offline executado usou instalação nova da versão atual; não simula atualização interrompida da versão antiga.
- Dados reais do navegador/celular do usuário não estavam nos arquivos e não foram exportados por esta execução. O app cria cópia local na primeira abertura, mas é essencial exportar o backup pela versão antiga antes da atualização.
- Não há como reconstruir programações ou áreas históricas que a versão antiga não registrou. A programação conhecida na atualização serve como base anterior à primeira edição; novas versões passam a ser preservadas. Relatórios identificam área antiga desconhecida, sem atribuí-la silenciosamente à área atual.
- As versões de programação têm precisão de dia. Edições sucessivas no mesmo dia usam a última programação daquele dia; conclusões existentes mantêm nome, valor e horário originais.
- Tarefas antigas configuradas como repetíveis aceitam registros intencionais separados após o bloqueio breve contra toques rápidos. Use “1× por dia” quando cada dia representar um único evento.
- A sincronização entre abas reduz conflitos e detecta estado desatualizado; localStorage não oferece transação com exclusão mútua entre processos. Evite registrar simultaneamente em duas janelas. Dados locais também não sincronizam entre aparelhos.
- Níveis e conquistas ficaram para uma etapa futura, conforme sua prioridade inferior no prompt. Registros válidos com IDs e reversões permitem calcular progressão sem depender do saldo.

## Arquivos

Modificados: `index.html` e `sw.js`. Criados: `.nojekyll` e este relatório. Manifesto, ícones, `LEIA-ME.md` e o arquivo original `nojekyll.txt` foram preservados. Nenhum arquivo original foi removido. O ZIP de segurança contém a versão recebida integral.

## Como atualizar

1. No app que contém seus dados reais, abra Regras → Exportar backup e guarde o JSON fora do navegador. Não desinstale o app nem limpe seus dados.
2. Substitua os arquivos hospedados pelos arquivos desta pasta, mantendo exatamente o mesmo domínio e caminho. Trocar a origem ou usar outro perfil do navegador não transporta os dados locais.
3. Feche todas as janelas do app e abra novamente com internet. Uma atualização pode primeiro ser instalada em espera; feche todas as janelas e reabra para ativá-la. Confira “Versão 2.6” em Regras.
4. Confira o saldo e um registro antigo, exporte novo backup e teste a abertura offline. Não é necessário desinstalar para atualizar os arquivos web.

Para testar localmente, sirva a pasta por HTTP em localhost; abrir o HTML por duplo clique não valida o PWA. Para instalar, abra a URL HTTPS no navegador e use a opção de instalação disponível. A geração/assinatura de APK não faz parte desta entrega.

## Exportar, restaurar e recuperar

Em Regras, use Exportar backup. O arquivo JSON contém os dados necessários à restauração; relatórios e capturas de tela não são backups.

Em Regras → Importar backup, selecione o JSON. O app valida o conteúdo, mostra quantidades e saldo, informa que substituirá os dados e pede confirmação. A versão atual fica em `tokens_v1_prev`; “Desfazer última importação” permite voltar. Não combina cadastros, portanto importar duas vezes não duplica lançamentos.

Se a gravação estiver bloqueada por dados inválidos, baixe os dados originais pelo botão exibido e restaure um backup válido. Se faltar espaço, libere espaço do aparelho sem limpar os dados do site e exporte o backup. A cópia `tokens_v1_before_2_6` é uma salvaguarda adicional para recuperação técnica pela chave localStorage. Guarde sempre o JSON exportado fora do aparelho.
