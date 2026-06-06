export class AdoptionDTO {
    constructor(adoption) {
        this._id = adoption._id;
        this.id = adoption._id;
        this.name = adoption.name;
        this.species = adoption.species;
        this.age = adoption.age;
        this.description = adoption.description;
        this.status = adoption.status;
        this.owner = adoption.owner;
        this.adoptedAt = adoption.adoptedAt;
        this.createdAt = adoption.createdAt;
        this.updatedAt = adoption.updatedAt;
    }
}

export class CreateAdoptionDTO {
    constructor(data) {
        this.name = data.name;
        this.species = data.species;
        this.age = data.age;
        this.description = data.description;
        this.status = data.status || 'available';
    }
}
