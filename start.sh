#!/bin/bash

echo "========================================"
echo "🚀 PELADA FÁCIL - INICIALIZADOR"
echo "========================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Matar processos antigos
echo "🧹 Limpando processos antigos..."
killall node 2>/dev/null || true
killall python3 2>/dev/null || true
fuser -k 5000/tcp 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true
sleep 2

# Iniciar Backend
echo ""
echo -e "${YELLOW}📦 Iniciando Backend...${NC}"
cd backend
node server.js > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"
sleep 3

# Verificar se backend está rodando
if curl -s http://localhost:5000/api/stats/dashboard > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend respondendo na porta 5000${NC}"
else
    echo -e "${RED}❌ Backend não está respondendo${NC}"
    echo "Verifique o arquivo backend.log para detalhes"
fi

# Iniciar Frontend
echo ""
echo -e "${YELLOW}🌐 Iniciando Frontend...${NC}"
cd ../frontend
python3 -m http.server 3000 > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend iniciado (PID: $FRONTEND_PID)${NC}"

echo ""
echo "========================================"
echo -e "${GREEN}✅ TUDO PRONTO!${NC}"
echo "========================================"
echo ""
echo "📊 Backend:  http://localhost:5000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "🔐 Credenciais de teste:"
echo "   Email: admin@peladafacil.com"
echo "   Senha: admin123"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend/backend.log"
echo "   Frontend: tail -f frontend/frontend.log"
echo ""
echo "⏹️  Para parar:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "PIDs salvos em pids.txt"
echo "$BACKEND_PID $FRONTEND_PID" > pids.txt

# Manter script rodando
echo ""
echo "✨ Pressione Ctrl+C para parar todos os serviços"
echo ""

# Função de limpeza ao sair
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Serviços parados"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Aguardar indefinidamente
wait
