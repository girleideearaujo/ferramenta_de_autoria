const draggableTemplate = document.getElementById('draggable-template');
const nomeDoArquivo = document.getElementById('nome-arquivo')
const searchId = document.getElementById('searchId')
const saveButton = document.getElementById('save-button');
const saveButtonOrganize = document.getElementById('save-button-organize');
const saveButtonSearch = document.getElementById('save-button-search');
const selectLayout = document.getElementById('select-layout')
const mainArea = document.getElementById('main-area');
const deleteButton = document.getElementById('delete-button');
const searchButton = document.getElementById('search-button');
const organizeButton = document.getElementById('organize-buton')
const editModal = document.getElementById('edit-modal');
const exportModal = document.getElementById('export-modal');
const searchModal = document.getElementById('search-modal');
const resultModal = document.getElementById('result-modal');
const closeModalButtons = document.querySelectorAll('.modal .close');
const editForm = document.getElementById('edit-form');
const titleInput = document.getElementById('title');
const parentSelect = document.getElementById('parent');
const parentListUl = document.getElementById('parent-list-ul');
const exportButton = document.getElementById('export-button');
const exportButtons = document.querySelectorAll('.export-button');
const closeResultModalButton = document.getElementById('close-result-modal');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const organizeModal = document.getElementById('organize-modal');



        // Configura Neo4j Driver
        const driver = neo4j.driver(
            "bolt://localhost:7687",
            neo4j.auth.basic("neo4j", "funcionaporfavor") // substitua pela sua senha
        );

			var config = {
				containerId: 'main-area',
				neo4j: {
					serverUrl: 'bolt://localhost:7687',
					serverUser: 'neo4j',
					serverPassword: 'funcionaporfavor'
				},
				visConfig: {
					nodes: {
						shape: 'square'
					},
					edges: {
						arrows: {
							to: {enabled: true}
						}
					},
				},
				labels: {
					Topic: {
						label: 'id',
					}
				},
                relationships: {
					PREREQUISITE: {
						value: "weight"
					}
				},
				initialCypher: 'MATCH (n:Topic)-[p:PREREQUISITE]->(m:Topic) RETURN n, p, m'
			};

			viz = new NeoVis.default(config);
			viz.render();
			console.log(viz);
        async function addNode(id) {
            const session = driver.session();
            try {
                await session.run(
                    'CREATE (p:Topic {id: $id})',
                    {id: id }
                );
            } catch (err) {
                console.error(err);
            } finally {
                await session.close();
            }
        }

draggableTemplate.addEventListener('click', () => {
        editModal.style.display = 'flex';
    });
saveButton.addEventListener('click', () => {
        editModal.style.display = 'none';
        if (titleInput.value !== '') {
        console.log('entrou');
        var id = titleInput.value
        addNode(id)
        } else {
            alert('')
        }
        console.log('a');
        
    })