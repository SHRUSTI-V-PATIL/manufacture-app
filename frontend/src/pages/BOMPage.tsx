import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TreeView,
  TreeItem,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  ExpandMore,
  ChevronRight,
  AccountTree,
  List as ListIcon,
  Build,
  Assignment,
  Calculate
} from '@mui/icons-material';

interface Material {
  _id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  unitCost: number;
}

interface BOMComponent {
  _id: string;
  material: Material;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  scrapPercentage: number;
  isOptional: boolean;
  sequence: number;
  notes?: string;
}

interface BOM {
  _id: string;
  bomNumber: string;
  product: Material;
  version: string;
  status: 'draft' | 'active' | 'inactive' | 'revision';
  description: string;
  baseQuantity: number;
  totalCost: number;
  components: BOMComponent[];
  routingSequence?: string[];
  validFrom: string;
  validTo?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface BOMExplosion {
  material: Material;
  level: number;
  quantity: number;
  totalQuantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  parent?: string;
}

const BOMPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [boms, setBOMs] = useState<BOM[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBOM, setSelectedBOM] = useState<BOM | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bomExplosion, setBOMExplosion] = useState<BOMExplosion[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    bomNumber: '',
    productId: '',
    version: '1.0',
    description: '',
    baseQuantity: 1,
    validFrom: new Date().toISOString().split('T')[0]
  });

  const [components, setComponents] = useState<Omit<BOMComponent, '_id'>[]>([]);
  const [newComponent, setNewComponent] = useState({
    materialId: '',
    quantity: 0,
    scrapPercentage: 0,
    isOptional: false,
    sequence: 1,
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Mock materials data
      const mockMaterials: Material[] = [
        {
          _id: '1',
          code: 'PRD-001',
          name: 'Finished Product A',
          category: 'Finished Goods',
          unit: 'ea',
          unitCost: 150.00
        },
        {
          _id: '2',
          code: 'STL-001',
          name: 'Steel Plate 10mm',
          category: 'Raw Materials',
          unit: 'kg',
          unitCost: 2.50
        },
        {
          _id: '3',
          code: 'ALU-002',
          name: 'Aluminum Rod 20mm',
          category: 'Raw Materials',
          unit: 'm',
          unitCost: 8.75
        },
        {
          _id: '4',
          code: 'BRG-003',
          name: 'Ball Bearing 6205',
          category: 'Components',
          unit: 'pcs',
          unitCost: 12.30
        },
        {
          _id: '5',
          code: 'SCR-004',
          name: 'Hex Bolt M8x20',
          category: 'Fasteners',
          unit: 'pcs',
          unitCost: 0.25
        },
        {
          _id: '6',
          code: 'SUB-001',
          name: 'Motor Assembly',
          category: 'Sub-assemblies',
          unit: 'ea',
          unitCost: 75.00
        }
      ];

      // Mock BOM data
      const mockBOMs: BOM[] = [
        {
          _id: '1',
          bomNumber: 'BOM-PRD-001-V1.0',
          product: mockMaterials[0],
          version: '1.0',
          status: 'active',
          description: 'Bill of Material for Finished Product A',
          baseQuantity: 1,
          totalCost: 0,
          components: [
            {
              _id: '1',
              material: mockMaterials[1],
              quantity: 2.5,
              unit: 'kg',
              unitCost: 2.50,
              totalCost: 6.25,
              scrapPercentage: 5,
              isOptional: false,
              sequence: 1,
              notes: 'Primary structural material'
            },
            {
              _id: '2',
              material: mockMaterials[3],
              quantity: 4,
              unit: 'pcs',
              unitCost: 12.30,
              totalCost: 49.20,
              scrapPercentage: 2,
              isOptional: false,
              sequence: 2
            },
            {
              _id: '3',
              material: mockMaterials[4],
              quantity: 8,
              unit: 'pcs',
              unitCost: 0.25,
              totalCost: 2.00,
              scrapPercentage: 0,
              isOptional: false,
              sequence: 3
            },
            {
              _id: '4',
              material: mockMaterials[5],
              quantity: 1,
              unit: 'ea',
              unitCost: 75.00,
              totalCost: 75.00,
              scrapPercentage: 0,
              isOptional: false,
              sequence: 4
            }
          ],
          validFrom: '2024-01-01',
          createdBy: 'Engineering Team',
          approvedBy: 'Chief Engineer',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        }
      ];

      // Calculate total costs
      mockBOMs.forEach(bom => {
        bom.totalCost = bom.components.reduce((acc, comp) => acc + comp.totalCost, 0);
      });

      setMaterials(mockMaterials);
      setBOMs(mockBOMs);
    } catch (err) {
      setError('Failed to fetch BOM data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (bom?: BOM) => {
    if (bom) {
      setSelectedBOM(bom);
      setFormData({
        bomNumber: bom.bomNumber,
        productId: bom.product._id,
        version: bom.version,
        description: bom.description,
        baseQuantity: bom.baseQuantity,
        validFrom: bom.validFrom
      });
      setComponents(bom.components.map(comp => ({
        materialId: comp.material._id,
        quantity: comp.quantity,
        unit: comp.unit,
        unitCost: comp.unitCost,
        totalCost: comp.totalCost,
        scrapPercentage: comp.scrapPercentage,
        isOptional: comp.isOptional,
        sequence: comp.sequence,
        notes: comp.notes || '',
        material: comp.material
      })));
      setIsEditing(true);
    } else {
      setSelectedBOM(null);
      setFormData({
        bomNumber: '',
        productId: '',
        version: '1.0',
        description: '',
        baseQuantity: 1,
        validFrom: new Date().toISOString().split('T')[0]
      });
      setComponents([]);
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBOM(null);
    setIsEditing(false);
  };

  const handleAddComponent = () => {
    const material = materials.find(m => m._id === newComponent.materialId);
    if (!material) return;

    const totalCost = newComponent.quantity * material.unitCost * (1 + newComponent.scrapPercentage / 100);
    
    const component: Omit<BOMComponent, '_id'> = {
      materialId: material._id,
      material,
      quantity: newComponent.quantity,
      unit: material.unit,
      unitCost: material.unitCost,
      totalCost,
      scrapPercentage: newComponent.scrapPercentage,
      isOptional: newComponent.isOptional,
      sequence: newComponent.sequence,
      notes: newComponent.notes
    };

    setComponents(prev => [...prev, component]);
    setNewComponent({
      materialId: '',
      quantity: 0,
      scrapPercentage: 0,
      isOptional: false,
      sequence: components.length + 2,
      notes: ''
    });
  };

  const handleRemoveComponent = (index: number) => {
    setComponents(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const product = materials.find(m => m._id === formData.productId);
      if (!product) return;

      const totalCost = components.reduce((acc, comp) => acc + comp.totalCost, 0);

      if (isEditing && selectedBOM) {
        // Update BOM
        const updatedBOM: BOM = {
          ...selectedBOM,
          ...formData,
          product,
          totalCost,
          components: components.map((comp, index) => ({
            _id: (index + 1).toString(),
            ...comp
          })),
          updatedAt: new Date().toISOString()
        };
        setBOMs(prev => prev.map(b => b._id === selectedBOM._id ? updatedBOM : b));
      } else {
        // Create new BOM
        const newBOM: BOM = {
          _id: Date.now().toString(),
          ...formData,
          product,
          status: 'draft',
          totalCost,
          components: components.map((comp, index) => ({
            _id: (index + 1).toString(),
            ...comp
          })),
          createdBy: 'Current User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setBOMs(prev => [...prev, newBOM]);
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save BOM');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this BOM?')) {
      setBOMs(prev => prev.filter(b => b._id !== id));
    }
  };

  const handleBOMExplosion = (bom: BOM, quantity: number = 1) => {
    const explosion: BOMExplosion[] = [];
    
    // Add the main product
    explosion.push({
      material: bom.product,
      level: 0,
      quantity: quantity,
      totalQuantity: quantity,
      unit: bom.product.unit,
      unitCost: bom.product.unitCost,
      totalCost: quantity * bom.product.unitCost
    });

    // Add components
    bom.components.forEach(component => {
      const totalQuantity = component.quantity * quantity * (1 + component.scrapPercentage / 100);
      explosion.push({
        material: component.material,
        level: 1,
        quantity: component.quantity,
        totalQuantity,
        unit: component.unit,
        unitCost: component.unitCost,
        totalCost: totalQuantity * component.unitCost,
        parent: bom.product.code
      });
    });

    setBOMExplosion(explosion);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'inactive': return 'default';
      case 'revision': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Bills of Material
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create BOM
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* BOM Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total BOMs
                  </Typography>
                  <Typography variant="h4">
                    {boms.length}
                  </Typography>
                </Box>
                <Assignment color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active BOMs
                  </Typography>
                  <Typography variant="h4">
                    {boms.filter(b => b.status === 'active').length}
                  </Typography>
                </Box>
                <AccountTree color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Draft BOMs
                  </Typography>
                  <Typography variant="h4">
                    {boms.filter(b => b.status === 'draft').length}
                  </Typography>
                </Box>
                <Build color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Avg Components
                  </Typography>
                  <Typography variant="h4">
                    {Math.round(boms.reduce((acc, b) => acc + b.components.length, 0) / boms.length) || 0}
                  </Typography>
                </Box>
                <Calculate color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="BOM List" />
          <Tab label="BOM Explosion" />
          <Tab label="Where Used" />
        </Tabs>

        <CardContent>
          {activeTab === 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>BOM Number</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Version</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Components</TableCell>
                    <TableCell>Total Cost</TableCell>
                    <TableCell>Valid From</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {boms.map((bom) => (
                    <TableRow key={bom._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {bom.bomNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {bom.product.code}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {bom.product.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{bom.version}</TableCell>
                      <TableCell>
                        <Chip
                          label={bom.status}
                          color={getStatusColor(bom.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{bom.components.length}</TableCell>
                      <TableCell>${bom.totalCost.toFixed(2)}</TableCell>
                      <TableCell>{new Date(bom.validFrom).toLocaleDateString()}</TableCell>
                      <TableCell>{bom.createdBy}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleBOMExplosion(bom)}
                          title="View Explosion"
                        >
                          <AccountTree />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleOpenDialog(bom)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(bom._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 1 && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  options={boms}
                  getOptionLabel={(option) => `${option.bomNumber} - ${option.product.name}`}
                  onChange={(event, newValue) => {
                    if (newValue) handleBOMExplosion(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select BOM for Explosion" />
                  )}
                  sx={{ maxWidth: 400 }}
                />
              </Box>
              
              {bomExplosion.length > 0 && (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Level</TableCell>
                        <TableCell>Material Code</TableCell>
                        <TableCell>Material Name</TableCell>
                        <TableCell>Quantity per Unit</TableCell>
                        <TableCell>Total Quantity</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell>Unit Cost</TableCell>
                        <TableCell>Total Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bomExplosion.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography 
                              sx={{ 
                                paddingLeft: item.level * 2,
                                fontWeight: item.level === 0 ? 'bold' : 'normal'
                              }}
                            >
                              {item.level === 0 ? '0' : `${item.level}`}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              fontWeight={item.level === 0 ? 'bold' : 'normal'}
                              sx={{ paddingLeft: item.level * 2 }}
                            >
                              {item.material.code}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography 
                              fontWeight={item.level === 0 ? 'bold' : 'normal'}
                            >
                              {item.material.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {item.level > 0 ? item.quantity : '-'}
                          </TableCell>
                          <TableCell>{item.totalQuantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                          <TableCell>
                            <Typography fontWeight={item.level === 0 ? 'bold' : 'normal'}>
                              ${item.totalCost.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Where Used Analysis
              </Typography>
              <Typography color="textSecondary">
                Select a material to see where it's used across different BOMs.
              </Typography>
              {/* Where used functionality would be implemented here */}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit BOM Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit BOM' : 'Create New BOM'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* BOM Header */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                BOM Header
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="BOM Number"
                value={formData.bomNumber}
                onChange={(e) => setFormData({ ...formData, bomNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={materials.filter(m => m.category === 'Finished Goods')}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                value={materials.find(m => m._id === formData.productId) || null}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, productId: newValue?._id || '' });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Product" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Base Quantity"
                type="number"
                value={formData.baseQuantity}
                onChange={(e) => setFormData({ ...formData, baseQuantity: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valid From"
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            {/* Components Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                BOM Components
              </Typography>
            </Grid>

            {/* Add Component Form */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Add Component
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <Autocomplete
                        options={materials.filter(m => m.category !== 'Finished Goods')}
                        getOptionLabel={(option) => `${option.code} - ${option.name}`}
                        value={materials.find(m => m._id === newComponent.materialId) || null}
                        onChange={(event, newValue) => {
                          setNewComponent({ ...newComponent, materialId: newValue?._id || '' });
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Material" size="small" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Quantity"
                        type="number"
                        value={newComponent.quantity}
                        onChange={(e) => setNewComponent({ ...newComponent, quantity: Number(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Scrap %"
                        type="number"
                        value={newComponent.scrapPercentage}
                        onChange={(e) => setNewComponent({ ...newComponent, scrapPercentage: Number(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Sequence"
                        type="number"
                        value={newComponent.sequence}
                        onChange={(e) => setNewComponent({ ...newComponent, sequence: Number(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Notes"
                        value={newComponent.notes}
                        onChange={(e) => setNewComponent({ ...newComponent, notes: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Button
                        variant="contained"
                        onClick={handleAddComponent}
                        disabled={!newComponent.materialId || newComponent.quantity <= 0}
                        fullWidth
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Components List */}
            <Grid item xs={12}>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Seq</TableCell>
                      <TableCell>Material Code</TableCell>
                      <TableCell>Material Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell>Unit Cost</TableCell>
                      <TableCell>Scrap %</TableCell>
                      <TableCell>Total Cost</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {components.map((component, index) => (
                      <TableRow key={index}>
                        <TableCell>{component.sequence}</TableCell>
                        <TableCell>{component.material.code}</TableCell>
                        <TableCell>{component.material.name}</TableCell>
                        <TableCell>{component.quantity}</TableCell>
                        <TableCell>{component.unit}</TableCell>
                        <TableCell>${component.unitCost.toFixed(2)}</TableCell>
                        <TableCell>{component.scrapPercentage}%</TableCell>
                        <TableCell>${component.totalCost.toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveComponent(index)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={7} align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          Total BOM Cost:
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                          ${components.reduce((acc, comp) => acc + comp.totalCost, 0).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.productId || components.length === 0}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BOMPage;
