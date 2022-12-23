# OperationKeyManagement

### Location
The OperationKeyManagement is part of the TinyApplicationController.  
The TinyApplicationController is for managing the REST microservices of the application layer.  

### Description
The OperationKeyManagement is for preventing unwished service consumptions on the application layer.  
It loads the approved links from the ApplicationLayerTopology, alters the expected OperationKey on the server side and makes it available to the approved consumers only.  
The OperationKeyManagement enforces the type approval regime in the application layer.  

### Relevance
The OperationKeyManagement is core element of the application layer running in the live network at Telefonica Germany.

### Resources
- [Specification](./spec/)
- [TestSuite](./testing/)
- [Implementation](./server/)

### Comments
./.
