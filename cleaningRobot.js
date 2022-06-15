
class World {
    constructor(numFloors) {
        this.location = 0;
        this.floors = [];
        for (let i = 0; i < numFloors; i++) {
            this.floors.push({dirty: false});
        }
    }

    markFloorDirty(floorNumber) {
        this.floors[floorNumber].dirty = true;
    }

    simulate(action) {										//adicionadas as posições 2 e 3
        switch(action) {
        case 'SUCK':
            this.floors[this.location].dirty = false;
            break;
        case 'UPLEFT':
            this.location = 0;
            break;
        case 'UPRIGHT':
            this.location = 1;
            break;
		case 'DOWNLEFT':
            this.location = 2;
            break;
        case 'DOWNRIGHT':
            this.location = 3;
            break;
        }

        return action;
    }
}


// Faz a movimentação do agente randomicamente para um dos dois pisos adjacentes 

function reflexVacuumAgent(world) {												//alterada regra de movimentação RANDOMICA
    if (world.floors[world.location].dirty) { return 'SUCK'; }
   
	else if (world.location == 0) { 
		var posArray = ['UPRIGHT','DOWNLEFT'];
		var randomPos = Math.floor(Math.random()*posArray.length);
		return posArray[randomPos]; 
	}
    else if (world.location == 1) { 
		var posArray = ['DOWNRIGHT','UPLEFT'];
		var randomPos = Math.floor(Math.random()*posArray.length);
		return posArray[randomPos];
	}
	else if (world.location == 2) { 
		var posArray = ['UPLEFT','DOWNRIGHT'];
		var randomPos = Math.floor(Math.random()*posArray.length);
		return posArray[randomPos];
	}
    else if (world.location == 3) { 
		var posArray = ['UPRIGHT','DOWNLEFT'];
		var randomPos = Math.floor(Math.random()*posArray.length);
		return posArray[randomPos];
	}
	/*
	//faz a movimentação do agente em sentido anti-horário
	else if (world.location == 0)           { return 'UPRIGHT'; }
	else if (world.location == 1)           { return 'DOWNRIGHT'; }
	else if (world.location == 2)           { return 'UPLEFT'; }
	else if (world.location == 3)           { return 'DOWNLEFT'; }
	*/

}


