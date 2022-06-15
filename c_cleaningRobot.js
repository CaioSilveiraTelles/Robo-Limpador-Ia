

const SIZE = 100;
const colors = {
    perceptBackground: 'hsl(240,10%,85%)',
    perceptHighlight: 'hsl(60,100%,90%)',
    actionBackground: 'hsl(0,0%,100%)',
    actionHighlight: 'hsl(150,50%,80%)'
};


/* Crie um objeto de diagrama que inclua o mundo (model) e os elementos svg (viem) */
function makeDiagram(selector) {
    let diagram = {}, world = new World(4);
    diagram.world = world;
	diagram.xPosition = (floorNumber) => ((floorNumber % 2) == 0 ? 150 : 300);			//alterado para marcar as posições em X 
	diagram.yPosition = (floorNumber) => ((floorNumber >= 2) ? 340 : 150);				//adicionado para marcar as posições em Y

    diagram.root = d3.select(selector);
    diagram.robot = diagram.root.append('g')
        .attr('class', 'robot')
        .style('transform', `translate(${diagram.xPosition(world.location)}px,100px)`);
    diagram.robot.append('rect')
        .attr('width', SIZE)
        .attr('height', SIZE)
        .attr('fill', 'hsl(120,25%,50%)');
    diagram.perceptText = diagram.robot.append('text')
        .attr('x', SIZE/2)
        .attr('y', -25)
        .attr('text-anchor', 'middle');
    diagram.actionText = diagram.robot.append('text')
        .attr('x', SIZE/2)
        .attr('y', -10)
        .attr('text-anchor', 'middle');

    diagram.floors = [];
    for (let floorNumber = 0; floorNumber < world.floors.length; floorNumber++) {
        diagram.floors[floorNumber] =
            diagram.root.append('rect')
            .attr('class', 'clean floor') // for css
            .attr('x', diagram.xPosition(floorNumber))
            .attr('y', diagram.yPosition(floorNumber)+120)						//alterado para desenhar na posição Y
            .attr('width', SIZE)
            .attr('height', SIZE/4)
            .attr('stroke', 'black')
            .on('click', function() {
                world.markFloorDirty(floorNumber);
                diagram.floors[floorNumber].attr('class', 'dirty floor');
            });
    }
    return diagram;
}


/* Renderização do diagrama e dos labels de ação e de percepção do agente*/

function renderWorld(diagram) {
    for (let floorNumber = 0; floorNumber < diagram.world.floors.length; floorNumber++) {
        diagram.floors[floorNumber].attr('class', diagram.world.floors[floorNumber].dirty? 'dirty floor' : 'clean floor');
    }
	//alterado para movimentar em Y
    diagram.robot.style('transform', `translate(${diagram.xPosition(diagram.world.location)}px,${diagram.yPosition(diagram.world.location)}px)`); 				
}

function renderAgentPercept(diagram, dirty) {
    let perceptLabel = {false: "Piso Limpo", true: "Piso Sujo"}[dirty];
    diagram.perceptText.text(perceptLabel);
}

function renderAgentAction(diagram, action) {
    let actionLabel = {null: 'Aguardando', 'SUCK': 'Limpando', 'UPLEFT': 'Indo pra cima na esquerda', 'UPRIGHT': 'Indo para cima direita', 
	'DOWNLEFT': 'Indo para baixo esquerda', 'DOWNRIGHT': 'Indo para baixo direita'}[action];		//alterar ação de posições
    diagram.actionText.text(actionLabel);
}



/*
	Função que tem 50% de chance de marcar um piso ALEATÓRIO como sujo


*/
function markRandomDirty(diagram){
	var dirtyChance = Math.floor(Math.random()*10);
	if (dirtyChance >=5){
		var floorPos = Math.floor(Math.random() * diagram.world.floors.length);
		diagram.world.markFloorDirty(floorPos);
		diagram.floors[floorPos].attr('class', 'dirty floor');
	}
}



/* 	
	Controle do diagrama, chama as funções de simulação, renderização 
	e de marcar um piso como sujo randomicamente 
*/

const STEP_TIME_MS = 2500;
function makeAgentControlledDiagram() {
    let diagram = makeDiagram('#agent-controlled-diagram svg');

    function update() {
        let location = diagram.world.location;
        let percept = diagram.world.floors[location].dirty;
        let action = reflexVacuumAgent(diagram.world);
        diagram.world.simulate(action);
        renderWorld(diagram);
        renderAgentPercept(diagram, percept);
        renderAgentAction(diagram, action);
		markRandomDirty(diagram);
    }
    update();
    setInterval(update, STEP_TIME_MS);
}




makeAgentControlledDiagram();
