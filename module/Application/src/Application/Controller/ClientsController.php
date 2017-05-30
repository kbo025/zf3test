<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Application\Model\Client;

class ClientsController extends AbstractActionController
{
    public function indexAction()
    {
        return new ViewModel();
    }

    public function searchAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $client = new Client();
            $query = $this->getRequest()->getQuery();
            $data = $client->search (
                isset($query['page']) ? $query['page'] : 1, 
                isset($query['query']) ? $query['query'] : null 
            );
            if ($data) {   
                return new JsonModel([
                    'success' => true,
                    'msg' => 'OK',
                    'total' => $data['metadata']['total'],
                    'items' => $data['data']
                ]);
            }
                return new JsonModel(['code' => 400, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
    }

    public function saveAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {

            $this->getResponse()->setStatusCode(404);
            die(var_dump($this->_getParams()));
            return new JsonModel([ 'data' => $this->getRequest()->getPost('name') ]);

            $client = new Client($this->getRequest()->getParams());
            if ($client->save())
                return new JsonModel([
                    'success' => true,
                    'msg' => 'OK',
                    'data' => $client->serialize()
                ]);
            else
                return new JsonModel(['success' => false, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
    }

    public function deleteAction()
    {
        if ($this->getRequest()->isXmlHttpRequest()) {
            $client = new Client($this->getRequest()->getPost());
            if ($client->delete())
                return new JsonModel([
                    'success' => true,
                    'msg' => 'OK',
                    'data' => $client->serialize()
                ]);
            else
                return new JsonModel(['success' => false, 'message' => 'Bad Request']);
        }
        $this->getResponse()->setStatusCode(404);
    }
}
