var cy = cytoscape({
    container: document.getElementById('main-area'),
    elements: [],
    style: [
        {
            selector: 'node',
            style: {
                'shape': 'square',
                'background-color': '#DAF7A6',
                'label': 'data(id)',
                'color': '#000',
                'text-valign': 'center',
                'text-halign': 'center',
                'border':'black'
            }
        },
        {
            selector: 'edge',
            style: {
                'curve-style': 'bezier',
                'width': 0.5,
                'target-arrow-shape': 'triangle',
                'line-color': 'black',
                'target-arrow-color': '#141414'

            }
        },


    ],
    layout: {
        name: 'grid',
        rows: 1
    }
});

function getChildren(cy, nodeId) {
    var children = cy.edges().filter(function (edge) {
      return edge.data('source') === nodeId; 
    }).map(function (edge) {
      return edge.data('target'); 
    });
  
    return children
};
var nodes = cy.nodes()


function animateNodes(cy) {
    const nodesData = new Map();
  
    // Inicializar dados para cada nó existente
    cy.nodes().forEach(node => {
      const pos = node.position();
      nodesData.set(node.id(), {
        node,
        baseX: pos.x,
        baseY: pos.y,
        angle: Math.random() * 2 * Math.PI,
        radius: 1,
        speed: 0.05 + Math.random() * 0.02
      });
    });
  
    // Detectar movimento manual para atualizar a posição base
    cy.nodes().on('dragfree', (event) => {
      const node = event.target;
      const pos = node.position();
      const data = nodesData.get(node.id());
      if (data) {
        data.baseX = pos.x;
        data.baseY = pos.y;
      }
    });
  
    // Função de animação contínua com oscilação circular
    function updatePositions() {
      nodesData.forEach((data, id) => {
        data.angle += data.speed;
        const node = data.node;
        const pos = node.position();
        // Ajuste apenas se o nó não estiver sendo arrastado
        if (!node.grabbed()) {
          const x = data.baseX + Math.cos(data.angle) * data.radius;
          const y = data.baseY + Math.sin(data.angle) * data.radius;
          node.position({ x, y });
        } else {
          // Atualizar a base quando solto
          data.baseX = pos.x;
          data.baseY = pos.y;
        }
      });
      requestAnimationFrame(updatePositions);
    }
  
    updatePositions();
  }
  
document.addEventListener('DOMContentLoaded', () => {
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
    let selectedElement = null;
    let elements = [];

    var nodeCount = 0
    var firstNode = null;
    var listOfIds = []

    function countEdges(nodeId) {
        var node = cy.getElementById(nodeId)
        var incomingEdges = node.connectedEdges().filter(edge => edge.target().id() === nodeId)
        return incomingEdges.length
    }
    var color = ['#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#73008b', '#900C3F', '#4a235a', '#2e00d0', '#1700e7', '#0000ff']

    function addNode() {
        console.log('Aaaaaa');
        
        var id = titleInput.value
        var centerPosition = {
            x: cy.width() / 2,
            y: cy.height() / 2
        };
        cy.add({
            group: 'nodes',
            data: { id: id },
            position: centerPosition
        });
        listOfIds.push(id)
        titleInput.value = ''

    }

    function handleNodeClick(evt) {
        var node = evt.target;

        if (firstNode === null) {

            firstNode = node;
            node.select();
        } else if (firstNode !== node) {

            cy.add({
                group: 'edges',
                data: { id: 'e' + firstNode.data('id') + '-' + node.data('id'), source: firstNode.data('id'), target: node.data('id') }
            });


            firstNode.unselect();
            firstNode = null;

            nodes = cy.nodes()
            var nodeIds = nodes.map(node => node.id())
            for (var id of nodeIds) {
                console.log(id);
                console.log(nodeIds);
                var edges = countEdges(id)
                var node = cy.getElementById(id);
                if (edges >= color.length) {
                    edges = color.at(-1)
                }
                node.style('background-color', color[edges]);
            }
        }


    }

    function deleteSelectedElements() {
        var selectedElements = cy.$(':selected');
        if (selectedElements.length > 0) {
            selectedElements.remove();
            firstNode = null;
        } else {
            alert('No nodes selected to delete.');
        }

    }
    function searchNode(cy) {
        // Pesquisar o nó pelo ID ou por rótulo
        var id = searchId.value
        console.log(id);
        
        const targetNode = cy.nodes().filter(node => 
            node.id() === id 
        );
    
        if (targetNode.length > 0) {
            cy.center(targetNode);
            cy.zoom({ level: 2, position: targetNode.position() });
        } else {
            alert('node not found!');
        }
    }
    
 
    
    function changeNodeId() {
            return titleInput.value;
            
    }

    function organizeModel() {
        console.log('entrouuu');
        
        var opt = selectLayout.value;
        console.log(opt);
        var layout = cy.layout({
            name: `${opt}`
        });
        layout.run();
        organizeModal.style.display = 'none';

    }




    // editButton.addEventListener('click', changeNodeId)
    draggableTemplate.addEventListener('click', () => {
        editModal.style.display = 'flex';
    });
    saveButton.addEventListener('click', () => {
        editModal.style.display = 'none';
        addNode()
        animateNodes(cy);
    })

    deleteButton.addEventListener('click', deleteSelectedElements);
    cy.on('tap', 'node', handleNodeClick);
    organizeButton.addEventListener('click', () => {
        organizeModal.style.display = 'flex'
    })
    saveButtonOrganize.addEventListener('click', (e) => {
        e.preventDefault();
        organizeModel()
        animateNodes(cy)
        // 
   })
   saveButtonSearch.addEventListener('click', (e) => {
    e.preventDefault();
    searchNode(cy)
    searchModal.style.display = 'none'
    // 
})
   searchButton.addEventListener('click',()=>{
    searchModal.style.display = 'flex'
    
   })
    document.getElementById('close-button').addEventListener('click', () => {
        organizeModal.style.display = 'none';
        searchModal.style.display = 'none'
    })
    document.getElementById('search-close-button').addEventListener('click', () => {
        searchModal.style.display = 'none'
    })
    draggableTemplate.addEventListener('click', addNode);

    function updateParentSelect() {
        parentSelect.innerHTML = '';
        elements.forEach(el => {
            if (el !== selectedElement) {
                const option = document.createElement('option');
                option.value = el.id;
                option.textContent = el.textContent.trim();
                parentSelect.appendChild(option);
            }
        });
    }

    function createLine() {
        const line = document.createElement('div');
        line.classList.add('line');
        mainArea.appendChild(line);
        return line;
    }

    function updateLine(line, element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        line.style.width = `${length}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = '0 0';
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
    }

    function updateLines() {
        elements.forEach(el => {
            if (el.lines) {
                el.lines.forEach(lineInfo => {
                    updateLine(lineInfo.line, lineInfo.parent, el);
                });
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.fixed-sidebar') && !e.target.closest('.modal') && selectedElement) {
            selectedElement.classList.remove('selected');
            selectedElement = null;
            updateSelectedItems(); // Atualiza os itens selecionados ao clicar fora
        }
    });
    console.log('');

    deleteButton.addEventListener('click', () => {
        if (selectedElement) {
            elements.forEach(el => {
                if (el.lines) {
                    el.lines = el.lines.filter(lineInfo => lineInfo.parent !== selectedElement);
                    updateLines();
                }
            });
            if (selectedElement.lines) {
                selectedElement.lines.forEach(lineInfo => {
                    lineInfo.line.remove();
                });
            }
            elements = elements.filter(el => el !== selectedElement);
            selectedElement.remove();
            selectedElement = null;
            updateParentSelect();
            updateLines();
            updateSelectedItems(); // Atualiza os itens selecionados ao deletar
        }
    });



    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            editModal.style.display = 'none';
            exportModal.style.display = 'none';
            resultModal.style.display = 'none';
        });
    });

    window.onclick = (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none';
            if (selectedElement) {
                selectedElement.classList.remove('selected');
                selectedElement = null;
                updateSelectedItems(); // Atualiza os itens selecionados ao fechar o modal
            }
        }
        if (event.target === exportModal) {
            exportModal.style.display = 'none';
        }
        if (event.target === resultModal) {
            resultModal.style.display = 'none';
        }
    };

    // parentSelect.addEventListener('change', () => {
    //     if (selectedElement && parentSelect.selectedOptions.length > 0) {
    //         for (const option of parentSelect.selectedOptions) {
    //             const parentId = option.value;
    //             const parentElement = document.getElementById(parentId);

    //             if (!selectedElement.pendingParents) {
    //                 selectedElement.pendingParents = [];
    //             }

    //             if (!selectedElement.pendingParents.some(p => p === parentElement)) {
    //                 selectedElement.pendingParents.push(parentElement);
    //             }
    //         }
    //         updateParentList();
    //     }
    // });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (selectedElement) {
            const title = titleInput.value.trim();
            selectedElement.textContent = title; // Atualiza o texto do elemento selecionado

            if (!selectedElement.lines) {
                selectedElement.lines = [];
            }

            if (selectedElement.pendingParents) {
                selectedElement.pendingParents.forEach(parentElement => {
                    if (!selectedElement.lines.some(lineInfo => lineInfo.parent === parentElement)) {
                        const line = createLine();
                        selectedElement.lines.push({ parent: parentElement, line });
                        updateLine(line, parentElement, selectedElement);
                    }
                });
                delete selectedElement.pendingParents;
            }

            if (selectedElement.pendingRemoval) {
                selectedElement.pendingRemoval.forEach(parentElement => {
                    selectedElement.lines = selectedElement.lines.filter(lineInfo => {
                        if (lineInfo.parent === parentElement) {
                            lineInfo.line.remove();
                            return false;
                        }
                        return true;
                    });
                });
                delete selectedElement.pendingRemoval;
            }

            editModal.style.display = 'none';
            selectedElement.classList.remove('selected');
            selectedElement = null;
            updateSelectedItems(); // Atualiza os itens selecionados ao salvar
        }
    });

    function updateParentList() {
        parentListUl.innerHTML = '';
        if (selectedElement) {
            const parents = selectedElement.pendingParents || (selectedElement.lines && selectedElement.lines.map(lineInfo => lineInfo.parent)) || [];
            parents.forEach(parentElement => {
                const li = document.createElement('li');
                li.textContent = parentElement.textContent.trim();
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remover';
                removeButton.addEventListener('click', () => {
                    if (!selectedElement.pendingRemoval) {
                        selectedElement.pendingRemoval = [];
                    }
                    selectedElement.pendingRemoval.push(parentElement);
                    selectedElement.pendingParents = selectedElement.pendingParents.filter(p => p !== parentElement);
                    updateParentList();
                });
                li.appendChild(removeButton);
                parentListUl.appendChild(li);
            });
        }
    }

    exportButton.addEventListener('click', () => {
        exportModal.style.display = 'flex';
    });

    exportButtons.forEach(button => {
        button.addEventListener('click', () => {
  
            const disconnectedElements = elements.filter(el => !el.lines || el.lines.length === 0);
            if (disconnectedElements.length > 0) {
                resultTitle.textContent = "Export Error";
                resultMessage.textContent = "There are elements that are not connected.";
            } else if (nomeDoArquivo.value == '') {
                resultTitle.textContent = "Export Error";
                resultMessage.textContent = "Name your file";
            }  else {
                if (button.id === 'export-json') {
                    let json = cy.json(cy)
                    const jsonData = JSON.stringify(json);
                    const blob = new Blob([jsonData], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${nomeDoArquivo.value}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } else if (button.id === 'export-png') {
                    const png64 = cy.png({
                        output: 'blob',
                    });

                    mainArea.setAttribute('src', png64)
                    const blob = new Blob([png64], { type: "image/png" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${nomeDoArquivo.value}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                } else if (button.id === 'export-jpg') {
                    let jpg64 = cy.jpg(
                        {
                            output: 'blob',
                            bg: 'white',
                        }
                    )
                    mainArea.setAttribute('src', jpg64)
                    const blob = new Blob([jpg64], { type: "image/jpg" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${nomeDoArquivo.value}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } else if (button.id === 'export-sql') {
                    var sql = `create database ${nomeDoArquivo.value};\nCREATE TABLE nodes (\n\tnode_id varchar(500),\n\tprimary key(node_id)\n);\nCREATE TABLE node_parents (\n\tnode_id varchar(500),\n\tnode_parent varchar(500),\n\tprimary key(node_id)\n);\n`
                    const a = document.createElement("a");

                    
                    var nodeIds = nodes.map(node => node.id())
                    console.log(nodeIds);
                    
                    for (let i = 0; i < nodeIds.length; i++) {
                        sql += `INSERT INTO nodes (node_id) VALUES ("${nodeIds[i]}");\n`
                    }
                    

                    for (const id of nodeIds) {
                        var children = getChildren(cy, id)
                        for (const child of children) {
                         sql += `INSERT INTO node_parents (node_id, node_parent) VALUES ("${child}","${id}");\n`
                        }
                    }
                    const file = new Blob([sql], { type: 'text/sql' });
                    a.href = URL.createObjectURL(file);
                    a.download = `${nomeDoArquivo.value}.sql`;
                    a.click();
                    URL.revokeObjectURL(a.href);
                    console.log(nomeDoArquivo.value);
                    
                }

                resultTitle.textContent = "Successful export";
                resultMessage.textContent = "All elements are connected.";
            }
            exportModal.style.display = 'none';
            resultModal.style.display = 'flex';
        });
    });

    closeResultModalButton.addEventListener('click', () => {
        resultModal.style.display = 'none';
    });

    function updateSelectedItems() {
        const selectedItemsDiv = document.getElementById('selected-items');
        selectedItemsDiv.innerHTML = '';

        if (selectedElement) {
            if (selectedElement.lines && selectedElement.lines.length > 0) {
                selectedItemsDiv.innerHTML = `Itens pais: `;
                selectedElement.lines.forEach(lineInfo => {
                    selectedItemsDiv.innerHTML += `${lineInfo.parent.textContent.trim()} `;
                });
            } else {
                selectedItemsDiv.innerHTML = ``;
            }
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        const toggleSidebarButton = document.getElementById('toggle-sidebar-button');
        const fixedSidebar = document.querySelector('.fixed-sidebar');

        toggleSidebarButton.addEventListener('click', () => {
            fixedSidebar.classList.toggle('visible');
        });
    });

});


